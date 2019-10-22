import concurrently from 'concurrently';
import stream from 'stream';
import stripAnsi from 'strip-ansi';

export type Options = concurrently.Options & {
  // cd to cwd before executing the command
  cwd?: string;
  // Strips ansi codes from command output
  stripAnsi?: boolean;
  // A prefix that prepends to each line of output rather than each chunk
  linePrefix?: string;
  // Execute commands sequentially rather than in parallel
  sequential?: boolean;
  // Function that measures success of the first watch output, triggers onWatchSuccess
  watchFirstSuccessCondition?: (output: string) => boolean;
  // Function that measures success of watch output, triggers onWatchSuccess
  watchSuccessCondition?: (output: string) => boolean;
  // Triggered when a successful watch compilation has finished, triggered by either
  // watchFirstSuccessCondition or watchSuccessCondition
  onWatchSuccess?: (result: { firstSuccess: boolean }) => void;
};

/**
 * Simple proxy of process.stdout that we can use to observe spawned concurrently process output.
 * It's not possible to listen to process.stdout directly - https://github.com/nodejs/node/issues/8033
 */
class StdoutProxy extends stream.Writable {
  stripAnsi?: boolean = false;
  linePrefix?: string;

  constructor(
    customOpts: Pick<Options, 'linePrefix' | 'stripAnsi'> = {},
    opts?: stream.WritableOptions,
  ) {
    super(opts);
    if (customOpts.linePrefix) {
      this.linePrefix = customOpts.linePrefix;
    }
    if (customOpts.stripAnsi) {
      this.stripAnsi = customOpts.stripAnsi;
    }
  }
  _write(chunk: any, _: string, callback: () => void): void {
    const output: string = chunk.toString().trimEnd('\n');
    if (output !== '') {
      this.log(output);
    }
    this.emit('data', output);
    callback();
  }

  log(output: string) {
    let finalOutput = output;
    if (this.stripAnsi) {
      finalOutput = stripAnsi(output);
    }
    if (this.linePrefix) {
      const lines = finalOutput.split('\n').filter(l => l !== '');
      lines.forEach(line => {
        console.log(this.linePrefix, line);
      });
    } else {
      console.log(finalOutput);
    }
  }
}

const defaultOpts: Pick<
  concurrently.Options,
  'killOthers' | 'prefix' | 'raw' | 'outputStream'
> = {
  // Will kill other processes when one fails
  killOthers: ['failure'],
  // Opt out of default logging prefix of index/name - bolt does most of this for us already
  prefix: 'none',
  // Raw mode will strictly output only raw output, rather than extra stuff
  // that concurrently outputs. We enable the extra output for now.
  raw: false,
};

/**
 * Parses process stdout for the provided success conditions and triggers `onWatchSuccess` callback on success
 */
function listenForSuccess({
  stdoutProxy,
  watchFirstSuccessCondition,
  watchSuccessCondition,
  onWatchSuccess,
}: {
  stdoutProxy: StdoutProxy;
  watchFirstSuccessCondition?: (output: string) => boolean;
  watchSuccessCondition?: (output: string) => boolean;
  onWatchSuccess?: (args: { firstSuccess: boolean }) => any;
}): () => void {
  let hasSucceededOnce = !watchFirstSuccessCondition;
  if (
    onWatchSuccess &&
    !(watchFirstSuccessCondition || watchSuccessCondition)
  ) {
    throw 'Must provide either watchSuccessCondition or watchFirstSuccessCondition with onWatchSuccess';
  } else if (!onWatchSuccess) {
    return () => {};
  }

  const listener = (output: string) => {
    let successful = false;
    if (watchSuccessCondition && hasSucceededOnce) {
      successful = watchSuccessCondition(output);
    } else if (!hasSucceededOnce && watchFirstSuccessCondition) {
      successful = watchFirstSuccessCondition(output);
    }
    if (successful) {
      onWatchSuccess({ firstSuccess: !hasSucceededOnce });
      hasSucceededOnce = true;
    }
  };

  stdoutProxy.on('data', listener);

  return () => {
    stdoutProxy.removeListener('data', listener);
  };
}

export default async function runCommands(
  commands: string[],
  opts: Options = {},
): Promise<any> {
  const {
    stripAnsi,
    sequential,
    watchFirstSuccessCondition,
    watchSuccessCondition,
    onWatchSuccess,
    linePrefix,
    cwd,
    ...concurrentlyOpts
  } = opts;
  if (commands.length === 0) {
    return;
  }

  const stdoutProxy = new StdoutProxy({ linePrefix, stripAnsi });
  if (commands.length === 1 || !sequential) {
    const unsubscribe = listenForSuccess({
      stdoutProxy,
      watchFirstSuccessCondition,
      watchSuccessCondition,
      onWatchSuccess,
    });
    let result;
    try {
      const mappedCommands = commands.map(c =>
        cwd ? `cd "${cwd}" && ${c}` : c,
      );
      result = await concurrently(mappedCommands, {
        ...defaultOpts,
        ...concurrentlyOpts,
        // Set output stream to our stdoutProxy rather than stdout so we can listen to stdout.
        // Used as part of watch mode to identify when recompiles are finished
        outputStream: stdoutProxy,
      });
    } catch (e) {
      if (e.constructor === Error) {
        // Hide internal concurrently stack trace as it does not provide anything useful
        // See https://github.com/kimmobrunfeldt/concurrently/issues/181
        throw Error('Command failed');
      }
      // Other types of errors should be thrown as-is
      throw e;
    }
    unsubscribe();
    return result;
  } else {
    let result;
    for (const command of commands) {
      result = await runCommands([command], opts);
    }
    return result;
  }
}
