import { Observable } from 'rxjs/Observable';

// We can't use observable.toPromise() because it only resolves when the observable completes, which never happens with ReplaySubject
export const observableToPromise = <T>(
  observable: Observable<T>,
): Promise<T> => {
  return new Promise<T>(resolve => {
    const subscription = observable.subscribe({
      next: state => {
        resolve(state);
        // We unsubscribe on the next tick since "next" callback gets called sync and "subscribe" didn't return anything yet
        setTimeout(() => subscription && subscription.unsubscribe(), 0);
      },
    });
  });
};
