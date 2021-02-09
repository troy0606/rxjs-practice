import { from } from "rxjs";
import { map, pairwise, scan } from "rxjs/operators";

export function operatorPractice() {
  const priceHistories = [100, 98, 96, 102, 99, 105, 105];

  const source$ = from(priceHistories).pipe(
    // 讓資料成雙成對出現
    pairwise(),
    // 將資料整理成物件
    map(([yesterdayPrice, todayPrice], index) => ({
      day: index + 2,
      todayPrice,
      // 計算是否上漲下跌
      priceUp: todayPrice > yesterdayPrice,
      priceDown: todayPrice < yesterdayPrice,
    })),
    // 逐步計算股價小於 100 的天數
    scan(
      (accu, value) => ({
        ...value,
        // 股價小於 100，天數 + 1
        priceBelow100Days:
          accu.priceBelow100Days + (value.todayPrice < 100 ? 1 : 0),
      }),
      {
        day: 1,
        todayPrice: 0,
        priceUp: false,
        priceDown: false,
        priceBelow100Days: 0,
      }
    )
  );

  source$.subscribe((data) => {
    console.log(`第 ${data.day} 天`);
    console.log(`本日股價: ${data.todayPrice}`);
    console.log(
      `本日股價 ${data.priceUp ? "上漲" : data.priceDown ? "下跌" : "持平"}`
    );
    console.log(`歷史股價小於 100 的有 ${data.priceBelow100Days} 天`);
  });
}
