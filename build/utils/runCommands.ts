import concurrently from 'concurrently';
import stream from 'stream';

/**
 * Simple proxy of process.stdout that we can use to observe spawned concurrently process output.
 * It's not possible to listen to process.stdout directly - https://github.com/nodejs/node/issues/8033
 */
class StdoutProxy extends stream.Writable {
  _write(chunk: any, _: string, callback: () => void): void {
    const output: string = chunk.toString().trimEnd('\n');
    if (output !== '') {
      console.log(output);
    }
    this.emit('data', output);
    callback();
  }
}

const stdoutProxy = new StdoutProxy();

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
  // Set output stream to our stdoutProxy rather than stdout so we can listen to stdout.
  // Used as part of watch mode to identify when recompiles are finished
  outputStream: stdoutProxy,
};

/**
 * Parses process stdout for the provided success conditions and triggers `onWatchSuccess` callback on success
 */
function listenForSuccess({
  watchFirstSuccessCondition,
  watchSuccessCondition,
  onWatchSuccess,
}: {
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
      onWatchSuccess({ firstSuccess: hasSucceededOnce });
      hasSucceededOnce = true;
    }
  };

  stdoutProxy.on('data', listener);

  return () => {
    stdoutProxy.off('data', listener);
  };
}

export type Options = concurrently.Options & {
  sequential?: boolean;
  watchFirstSuccessCondition?: (output: string) => boolean;
  watchSuccessCondition?: (output: string) => boolean;
  onWatchSuccess?: () => void;
};

export default async function runCommands(
  commands: string[],
  opts: Options = {},
): Promise<any> {
  const {
    sequential,
    watchFirstSuccessCondition,
    watchSuccessCondition,
    onWatchSuccess,
    ...concurrentlyOpts
  } = opts;
  if (commands.length === 0) {
    return;
  }
  if (commands.length === 1 || !sequential) {
    const unsubscribe = listenForSuccess({
      watchFirstSuccessCondition,
      watchSuccessCondition,
      onWatchSuccess,
    });
    let result;
    try {
      result = await concurrently(commands, {
        ...defaultOpts,
        ...concurrentlyOpts,
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
      result = await runCommands([command]);
    }
    return result;
  }
}
