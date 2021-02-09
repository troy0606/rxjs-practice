import {
  BehaviorSubject,
  concat,
  fromEvent,
  interval,
  merge,
  of,
  partition,
  zip,
} from "rxjs";
import { map, take, tap } from "rxjs/operators";

export function combineCreateObservablePt1() {
  // concat
  // concat 可以將數個 Observables 組合成一個新的 Observable，
  // 並且在每個 Observable 結束後才接續執行下一個 Observable

  const concatSourceA$ = of(1, 2);
  const concatSourceB$ = of(3, 4);
  const concatSourceC$ = of(5, 6);

  concat(concatSourceA$, concatSourceB$, concatSourceC$).subscribe({
    next: (data) => console.log(`concat 範例(1): ${data}`),
    complete: () => console.log(`concat 範例(1): 結束`),
  });
  //   (1,2,3,4,5,6)|

  // merge
  //   會同時啟動參數內所有的 Observable，因此會有「平行處理」的感覺

  const mergeSourceA$ = interval(1000).pipe(
    take(3),
    map((data) => `A${data}`)
  );
  const mergeSourceB$ = interval(2500).pipe(
    take(3),
    map((data) => `B${data}`)
  );
  const mergeSourceC$ = interval(5000).pipe(
    take(3),
    map((data) => `C${data}`)
  );

  const mergeSubscription = merge(
    mergeSourceA$,
    mergeSourceB$,
    mergeSourceC$
  ).subscribe({
    next: (data) => console.log(`merge 範例(1): ${data}`),
    complete: () => console.log(`merge 範例(1): 結束`),
  });

  // sourceA$: --A1--A2--A3--------------....
  // sourceB$: --------B1--------B2------...
  // sourceC$: ------------------C1------....

  // merge(sourceA$, sourceB$, sourceC$)
  // --A1--A2-B1-A3------(B2,C1)---c2---c3|...

  // zip
  //   zip 會將傳入的 Observables 依次組合在一起成為一個陣列，已經被組合過的就不會再次被組合
  const zipSourceA$ = interval(1000).pipe(
    take(3),
    map((data) => `A${data + 1}`)
  );
  const zipSourceB$ = interval(2000).pipe(
    take(4),
    map((data) => `B${data + 1}`)
  );
  const zipSourceC$ = interval(3000).pipe(
    take(5),
    map((data) => `C${data + 1}`)
  );
  //雖然B跟C的observable拿了4,5個，但A只拿三個，
  // 所以拿完第三個zip之後的observable陣列，就會呼叫訂閱者complete

  zip(zipSourceA$, zipSourceB$, zipSourceC$).subscribe({
    next: (data) => console.log(`zip 範例(1): ${data}`),
    complete: () => console.log(`zip 範例(1): 結束`),
  });

  //   sourceA$: --A1--A2--A3----............
  // sourceB$:   ----B1  ----B2  ----B3--....
  // sourceC$:     ------C1    ------C2    ------C3......

  // zip(sourceA$, sourceB$, sourceC$)
  //                 [A1,B1,C1]  [A2,B2,C2]  [A3,B3,C3]

  //   partition

  const partitionSource$ = of(1, 2, 3, 4, 5, 6);

  const [partitionSourceEven$, partitionSourceOdd$] = partition(
    partitionSource$,
    (data) => data % 2 === 0
  );

  partitionSourceEven$.subscribe({
    next: (data) => console.log(`partitionSource 範例(1) 偶數: ${data}`),
    complete: () => console.log(`partitionSource 範例(1) 偶數: 結束`),
  });

  partitionSourceOdd$.subscribe({
    next: (data) => console.log(`partitionSource 範例(1) 奇數: ${data}`),
    complete: () => console.log(`partitionSource 範例(1) 奇數: 結束`),
  });

  //   partitionSource$:     -----1-----2-----3-----4-----5-----6-----|
  // [partitionSourceEven$, partitionSourceOdd$] = partition(source$, (data) => data % 2 === 0);

  // partitionSourceEven$: -----------2----------4------------6-----|
  // partitionSourceOdd$:  -----1------------3----------5-----------|

  //   實際運用
  window.onload = function () {
    const signInButton = document.createElement("button");
    signInButton.setAttribute("id", "signin");
    signInButton.innerText = "signIn";
    document.body.appendChild(signInButton);
    const signInStatus$ = new BehaviorSubject(false);
    // signInStatus$.next(!signInStatus$.getValue())

    const signUpButtonClick$ = fromEvent(signInButton, "click");
    signUpButtonClick$.subscribe((data) =>
      signInStatus$.next(!signInStatus$.getValue())
    );
    const [signInObservableTrue$, signInObservablefalse$] = partition(
      signInStatus$,
      (data) => data
    );

    signInObservableTrue$.subscribe({
      next: (data) => {
        signInButton.innerText = "signOut";
        console.log(`partitionSource 實作登入(1): 登入`);
      },
      complete: () => console.log(`partitionSource 實作登入(1): 結束`),
    });

    signInObservablefalse$.subscribe({
      next: (data) => {
        signInButton.innerText = "signIn";
        console.log(`partitionSource 實作登入(1): 登出`);
      },
      complete: () => console.log(`partitionSource 實作登入(1): 結束`),
    });
  };
}
