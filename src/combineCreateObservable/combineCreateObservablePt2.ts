import { combineLatest, forkJoin, interval, race } from "rxjs";
import { map, take } from "rxjs/operators";

export function combineCreateObservablePt2() {
  // combineLatest
  // combineLatest 跟 zip 非常像，差別在於 zip 會依序組合，
  // 而 combineLatest 會在資料流有事件發生時，
  // 直接跟目前其他資料流的「最後一個事件」組合在一起

  const combineLatestSourceA$ = interval(1000).pipe(
    take(3),
    map((data) => `A${data + 1}`)
  );
  const combineLatestSourceB$ = interval(2000).pipe(
    take(3),
    map((data) => `B${data + 1}`)
  );
  const combineLatestSourceC$ = interval(3000).pipe(
    take(3),
    map((data) => `C${data + 1}`)
  );

  const combineLatestSubscription = combineLatest([
    combineLatestSourceA$,
    combineLatestSourceB$,
    combineLatestSourceC$,
  ]).subscribe({
    next: (data) => console.log(`combineLatest 範例(1): ${data}`),
    complete: () => console.log(`combineLatest 範例(1): 結束`),
  });

  //   sourceA$: --A1--A2--A3
  // sourceB$:   ----B1            --B2        ....
  // sourceC$:     ------C1

  // combineLatest(sourceA$, sourceB$, sourceC$)
  //               ------**        --**        --**.......
  //                 [A3,B1,C1]  [A3,B1,C1]
  //                             [A3,B2,C1] (兩個來源 Observable 同時發生事件)

  // forkJoin
  // 會同時訂閱傳入的 Observables，直到每個 Observable 都「結束」後，
  // 將每個 Observable 的「最後一筆值」組合起來

  const forkJoinSourceA$ = interval(1000).pipe(
    map((data) => `A${data + 1}`),
    take(5)
  );
  const forkJoinSourceB$ = interval(2000).pipe(
    map((data) => `B${data + 1}`),
    take(4)
  );
  const forkJoinSourceC$ = interval(3000).pipe(
    map((data) => `C${data + 1}`),
    take(3)
  );

  forkJoin([forkJoinSourceA$, forkJoinSourceB$, forkJoinSourceC$]).subscribe({
    next: (data) => console.log(`forkJoin 範例: ${data}`),
    complete: () => console.log("forkJoin 結束"),
  });

  // forkJoinSourceA$: --A1--A2--A3--A4--A5|
  // forkJoinSourceB$: ----B1  ----B2  ----B3|
  // forkJoinSourceC$: ------C1    ------C2    ------C3|

  // forkJoin(forkJoinSourceA$, forkJoinSourceB$, forkJoinSourceC$)
  //               ------      ------      ------**|
  //                                         [A5,B3,C3]

  // race
  // 接受的參數一樣是數個 Observables，當訂閱發生時，這些 Observables 會同時開跑，
  // 當其中一個 Observable 率先發生事件後，就會以這個 Observable 為主，並退訂其他的 Observables

  const raceSourceA$ = interval(1000).pipe(
    take(3),
    map((data) => `A${data + 1}`)
  );
  const raceSourceB$ = interval(2000).pipe(
    take(3),
    map((data) => `B${data + 1}`)
  );
  const raceSourceC$ = interval(3000).pipe(
    take(3),
    map((data) => `C${data + 1}`)
  );

  const raceSubscription = race([
    raceSourceA$,
    raceSourceB$,
    raceSourceC$,
  ]).subscribe({
    next: (data) => console.log(`race 範例: ${data}`),
    complete: () => console.log("race 結束"),
  });

  // sourceA$: --A1--A2--A3.....
  // sourceB$:   ----B1.........
  // sourceC$:     ------C1.....

  // race(sourceA$, sourceB$, sourceC$)
  //           --A1--A2--A3.....
  //             ^ sourceA$ 先到了，因此退訂 sourceB$ 和 sourceC$
}
