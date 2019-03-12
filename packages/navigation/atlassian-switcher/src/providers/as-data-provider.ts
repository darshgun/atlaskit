import { Component, ReactNode } from 'react';

enum Status {
  LOADING = 'loading',
  COMPLETE = 'complete',
  ERROR = 'error',
}

export interface ResultComplete<T> {
  status: Status.COMPLETE;
  data: T;
}

export interface ResultLoading {
  status: Status.LOADING;
  data: null;
}

export interface ResultError {
  status: Status.ERROR;
  error: any;
  data: null;
}

export const isComplete = <T>(
  result: ProviderResult<T>,
): result is ResultComplete<T> => result.status === Status.COMPLETE;

export const isError = <T>(result: ProviderResult<T>): result is ResultError =>
  result.status === Status.ERROR;

export const isLoading = <T>(
  result: ProviderResult<T>,
): result is ResultLoading => result.status === Status.LOADING;

export type ProviderResult<T> = ResultComplete<T> | ResultLoading | ResultError;

interface PropsToPromiseMapper<P, D> {
  (props: P): Promise<D>;
}

interface PropsToValueMapper<P, D> {
  (props: P): D;
}

export interface DataProviderProps<D> {
  children: (props: ProviderResult<D>) => ReactNode;
}

export default function<P, D>(
  mapPropsToPromise: PropsToPromiseMapper<Readonly<P>, D>,
  mapPropsToInitialValue?: PropsToValueMapper<Readonly<P>, D | void>,
) {
  return class extends Component<P & DataProviderProps<D>> {
    acceptResults = true;
    state = this.getInitialState();

    getInitialState(): ProviderResult<D> {
      if (mapPropsToInitialValue) {
        const initialValue = mapPropsToInitialValue(this.props);
        if (initialValue !== undefined) {
          return {
            status: Status.COMPLETE,
            data: initialValue,
          };
        }
      }

      return {
        status: Status.LOADING,
        data: null,
      };
    }

    componentWillUnmount() {
      this.acceptResults = false;
    }

    componentDidMount() {
      mapPropsToPromise(this.props)
        .then(result => {
          this.onResult(result);
        })
        .catch(error => {
          this.onError(error);
        });
    }

    onResult(value: D) {
      if (this.acceptResults) {
        this.setState({
          data: value,
          status: Status.COMPLETE,
        });
      }
    }

    onError(error: any) {
      if (this.acceptResults && isLoading(this.state)) {
        this.setState({
          error,
          status: Status.ERROR,
        });
      }
    }

    render() {
      return this.props.children(this.state);
    }
  };
}
