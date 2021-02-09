import { of } from "rxjs";
import { map, pairwise, scan } from "rxjs/operators";

export function operatorPt1() {
  // map
  // 把 Observable 每次「事件的值」換成「另外一個值」

  of(1, 2, 3, 4)
    .pipe(
      map((val) => val * 2),
      map((value, index) => `第 ${index} 次事件資料為 ${value}`)
    )
    .subscribe({
      next: (data) => console.log(`map 範例(1): ${data}`),
      complete: () => console.log(`map 範例(1): 結束`),
    });

  // scan
  //   scan 需要傳入兩個參數

  // 累加函數：這個函數被呼叫時會傳入三個參數，可以搭配這三個參數處理資料後回傳一個累加結果，函數參數包含
  // acc：目前的累加值，也就是上一次呼叫累加函數時回傳的結果
  // value：目前事件值
  // index：目前事件 index

  const donateAmount = [100, 500, 300, 250];

  const accumDonate$ = of(...donateAmount).pipe(
    scan(
      (acc, value) => acc + value, // 累加函數
      0 // 初始值
    )
  );

  accumDonate$.subscribe({
    next: (amount) =>
      console.log(`scan 範例(1): 目前 donate 金額累計: ${amount}`),
    complete: () => console.log(`scan 範例(1): 結束`),
  });

  //   (100      500      300      250|)
  // scan((acc, value) => acc + value, 0)
  // (100      600      900     1150|)

  //   pairwise
  // pairwise 可以將 Observable 的事件資料「成雙成對」的輸出，
  // 這個 operator 沒有任何參數

  of(1, 2, 3, 4, 5, 6)
    .pipe(pairwise())
    .subscribe({
      next: (data) => console.log(`pairwise 範例(1): ${data}`),
      complete: () => console.log(`pairwise 範例(1): 結束`),
    });

  // (      1      2      3      4      5      6|)
  // pairwise()
  // (           [1,2]  [2,3]  [3,4]  [4,4]  [5,6]|)
  //       ^ 第一次事件發生時會被過濾掉

  //   以scan模仿pairwise來達到第一次不忽略事件的資料流
  of(1, 2, 3, 4, 5, 6)
    .pipe(
      scan(
        // 因為第一次回傳的acc是[null,1]，之後有值就會改傳value
        (accu, value) => [accu === null ? null : accu[1], value],
        null
      )
    )
    .subscribe({
      next: (data) => console.log(`scan模仿pairwise 範例: ` + data),
      complete: () => console.log(`scan模仿pairwise: 結束`),
    });
}
