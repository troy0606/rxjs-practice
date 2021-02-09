import {
  from,
  of,
  fromEvent,
  fromEventPattern,
  interval,
  timer,
  defer,
} from "rxjs";

export function createObservablePt2() {
  // From
  // 可以接受的參數類型包含陣列、可疊代的物件 (iterable)、Promise 和「其他 Observable 實作」 等等

  from([1, 2, 3, 4]).subscribe((data) => {
    console.log(`from 示範 (1): ${data}`);
  });

  // 傳遞可迭代的物件當參數
  // function* range(start: number, end: number) {
  //   for(let i = start; i <= end; ++i){
  //     yield i;
  //   }
  // }

  // from(range(1, 4)).subscribe(data => {
  //   console.log(`from 示範 (2): ${data}`);
  // });

  // 傳遞 Promise 當參數
  from(Promise.resolve(1)).subscribe((data) => {
    console.log(`from 示範 (3): ${data}`);
  });

  // 傳遞 Observable 當參數
  from(of(1, 2, 3, 4)).subscribe((data) => {
    console.log(`from 示範 (4): ${data}`);
  });

  // fromEvent
  // 能將瀏覽器事件包裝成 Observable，參數有兩個：
  // target：實際上要監聽事件的 DOM 元素
  // eventName：事件名稱

  fromEvent(document, "click").subscribe((data) => {
    console.log("fromEvent 示範: 滑鼠事件觸發了");
  });

  // fromEventPattern
  // 可以根據自訂的邏輯決定事件發生，只要將邏輯寫好就好；
  // fromEventPattern 需要傳入兩個參數：
  // addHandler：當 subscribe 時，呼叫此方法決定如何處理事件邏輯
  // removeHandler：當 unsubscribe 時，呼叫次方法將原來的事件邏輯取消

  const addClickHandler = (handler: (arg0: MouseEvent) => any) => {
    console.log("fromEventPattern 示範: 自定義註冊滑鼠事件");
    document.addEventListener("click", (event) => handler(event));
  };

  const removeClickHandler = (
    handler: (this: Document, ev: MouseEvent) => any
  ) => {
    console.log("fromEventPattern 示範: 自定義取消滑鼠事件");
    document.removeEventListener("click", handler);
  };

  const source$ = fromEventPattern(addClickHandler, removeClickHandler);

  const subscription = source$.subscribe((event: any) =>
    console.log("fromEventPattern 示範: 滑鼠事件發生了", event)
  );

  setTimeout(() => {
    subscription.unsubscribe();
  }, 3000);

  // interval
  // interval 會依照的參數設定的時間 (毫秒) 來建立 Observable，當被訂閱時，
  // 會先等待一個指定時間，在每隔一段指定的時間發生一次資料流，資料流的值就是為事件是第幾次發生的 (從 0 開始)

  const intervalSubscription = interval(1000).subscribe({
    next: (data: number) => console.log(`interval 示範: ${data}`),
    error: (err) => console.log(`interval 錯誤: ${err}`),
    complete: () => console.log(`interval 示範結束`),
  });
  // ----0----1----2----3----.......

  setTimeout(() => {
    intervalSubscription.unsubscribe();
  }, 5500);
  // ----0----1----2----3----4--|

  // timer
  // timer 跟 interval 有點類似，但它多一個參數，
  // 用來設定經過多久時間後開始依照指定的間隔時間計時

  //    timer(等待時間，間隔時間)
  timer(0, 10000).subscribe((data) => console.log(`timer 示範: ${data}`));
  // 0----1----2----3----......

  timer(3000).subscribe({
    next: (data: number) => console.log(`timer 示範(2): ${data}`),
    error: (err) => console.log(`timer(2) 錯誤: ${err}`),
    complete: () => console.log(`timer 示範(2)結束`),
  });
  // --------------------0|
  // timer 如果沒有設定第二個參數，代表在指定的時間發生第一次事件後，就不會再發生任何事件了

  // defer
  // defer 會將建立 Observable 的邏輯包裝起來，提供更一致的使用感覺，
  // 使用 defer 時需要傳入一個 factroy function 當作參數，
  // 這個 function 裡面需要回傳一個 Observable (或 Promise 也行)，
  // 當 defer 建立的 Observable 被訂閱時，會呼叫這個 factroy function，並以裡面回傳的 Observer 當作資料流

  const factory = () => of(1, 2, 3);
  const deferSource$ = defer(factory);
  deferSource$.subscribe((data) => console.log(`defer 示範: ${data}`));

  // const p = new Promise((resolve) => {
  //   console.log("Promise 內被執行了");
  //   setTimeout(() => {
  //     resolve(100);
  //   }, 1000);
  // });
  // // Promise 內被執行了
  // // (就算還沒呼叫 .then，程式依然會被執行)

  // p.then((result) => {
  //   console.log(`Promise 處理結果: ${result}`);
  // });

  // Promise 雖然是非同步執行程式，但在 Promise 產生的一瞬間相關程式就已經在運作了：

  // 在設計 Observable 時如果可以延遲執行，直到被訂閱時才真的去執行相關邏輯
  // 將 Promise 包成起來
  // 因此在此 function 被呼叫前，都不會執行 Promise 內的程式
  const promiseFactory = () =>
    new Promise((resolve) => {
      console.log("Promise 內被執行了");
      setTimeout(() => {
        resolve(100);
      }, 1000);
    });
  const deferSource2$ = defer(promiseFactory);
  // 此時 Promise 內程式依然不會被呼叫
  console.log("示範用 defer 解決 Promise 的問題:");
  // 直到被訂閱了，才會呼叫裡面的 Promise 內的程式
  deferSource2$.subscribe((result) => {
    console.log(`defer Promise 結果: ${result}`);
  });
}
