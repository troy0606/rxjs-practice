import { EMPTY, iif, range, throwError } from "rxjs";
import { of } from "rxjs";

export function createObservablePt1() {
  // EMPTY
  EMPTY.subscribe((data) => console.log(`empty 範例: ${data}`));
  // (不會印出任何東西) 因沒有任何事件，會直接跳到complete

  EMPTY.subscribe({
    next: (data) => console.log(`empty 範例: ${data}`),
    complete: () => console.log("empty 結束"),
  });
  // empty 結束
  // 彈珠圖： |

  // of
  of(1).subscribe((data) => console.log(`of 範例: ${data}`));
  // 彈珠圖： (1|)
  of(1, 2, 3, 4).subscribe({
    next: (data) => console.log(`of 範例2: ${data}`),
    complete: () => console.log("of 範例2結束"),
  });
  // 彈珠圖： (1234|)

  // range 顧名思義就是依照一個範圍內的數列資料建立 Observable，包含兩個參數：
  // start: 從哪個數值開始
  // count: 建立多少個數值的數列
  range(3, 4).subscribe((data) => console.log(`range 範例: ${data}`));
  // 彈珠圖： (3456|)

  // iif 會透過條件來決定產生怎麼樣的 Observable，有三個參數：
  // condition: 傳入一個 function，這個 function 會回傳布林值。
  // trueResult: 當呼叫 condition 參數的 function 回傳 true 時，使用 trueResult 的 Observable
  // falseResult: 當呼叫 condition 參數的 function 回傳 false 時，使用 falseResult 的 Observable

  const emitHelloIfEven = (data: number) => {
    return iif(() => data % 2 === 0, of("Hello"), EMPTY);
  };

  emitHelloIfEven(1).subscribe((data: any) =>
    console.log(`iif 範例 (1): ${data}`)
  );
  // (不會印出任何東西)
  emitHelloIfEven(2).subscribe((data: any) =>
    console.log(`iif 範例 (2): ${data}`)
  );
  // iif 範例 (2): Hello

  // throwError
  //  發生錯誤 (error()) 用的！因此訂閱時要記得使用 error 來處理，同時當錯誤發生時，就不會有「完成」發生

  const throwErrorObservable$ = throwError("發生錯誤了");
  throwErrorObservable$.subscribe({
    next: (data) => console.log(`throwError 範例 (next): ${data}`),
    error: (error) => console.log(`throwError 範例 (error): ${error}`),
    complete: () => console.log("throwError 範例 (complete)"),
  });
  // throwError 範例 (error): 發生錯誤了
}
