# MakeNTU 機台借用網站

## [111-1] Web Programming Final

**Group 74**
組長： B09502138 徐明晧
組員： R09521260 林和毅、R10227105 王雅茵

## 網站服務連結
[MakeNTU網站](https://machine.ntuee.org/)

## Demo 影片連結
[MakeNTU Demo影片](https://youtu.be/Fu-NFM0y6Qc)

## Open Source Github Link
[開源程式碼repo](https://github.com/qaz159qaz159/makeNTU-2023-competetion)

## 網頁服務內容
- 主旨：提供MakeNTU創客松競賽之網站服務，提供機台預約及管理。

### 服務項目：
- 登入機制
  - Users / Admin
- 3D列印機
  - User：新增機台、清除機台、清除使用者、安排使用者
  - Admin：預約機台、察看目前狀態
- 雷射切割機
  - User：新增機台、管理機台排程、察看及控制機台狀態
  - Admin：預約雷切機台及材料，察看等候組數、等候時間、預約狀態


## 使用之第三方套件、框架、程式碼

### Frontend:
- `apollo/client`, `graphql-tools`, `react`, `react-dom`, `react-router-dom`, `styled-components`, `mui`, `axios`, `uuid`

### Backend:
- `apollo/server`, `graphql`, `node.js`, `babel`, `cors`, `express`, `nodeman`, `dotenv-defaults`, `mongoose`, `bcrypt`, `express`

### Database:
- `MongoDB`, `Redis`

### Container:
- `Docker`

### 程式碼參考來源:
-  [makeNTU-2023-competetion](https://github.com/NTUEEInfoDep/makeNTU-2023-competetion)
- 為符合電機系的要求並使其能夠合併到電機系的網站系統中，我們基於此架構發展出借用管理功能，後續利用PR將其合併到電機系的網站中

## 專題製作心得

#### 徐明晧
在這個專題中，我學習到如何建構一個網頁服務，在製作這個網頁服務時，我也重新檢視這學期所學，包括如何使用react建構前端網頁，以及利用GraphQL做為後端框架的情況下要如何處理前後端的溝通。另外，先前作業都是根據既定的spec來寫，而期末專題則需要自己從零開始構思，到底這個專案需要什麼樣的功能、要用甚麼樣的技術來實現，甚至是要如何優化、解決遇到的問題，都是非常踏的挑戰。在分工方面，我們組比較特別的是，在分工上每個人前、後端都會碰到，這樣做的好處是對於前後端各個component的功能、如何再次熟悉、認識這些前後端的技術，且這樣也能更多的去檢視他人的程式碼，學習找出其中的bug並溝通解決問題，降低出錯的機會，也更好維護。
#### 林和毅
這次專案設計使我有許多感悟，身處一定規模的專案之下也讓我感到興奮，因於在學期初的我連一行code都不會打，得瘋狂找資料自學，到現在能cover前後端、資料庫、GraphQL以及環境佈署等，建立出我理想中的網站，最後優化UI/UX。打心得的當下才敢稍微感受懈怠，也感謝組員的信任，讓我有成長及發揮的空間，並深感溝通、合作的重要性，體會寫出一個像樣的服務背後得有多少人的努力以及心思。在建構網站時，需要先把邏輯釐清，在執行階段時，才不會因為邏輯錯誤需要大修程式碼，與隊友的meeting也能優化思路，最後就是把自己的所學延伸，implement預期實現的功能，架出自己滿意的網站，最後感謝Ric老師開了這扇窗給我。
#### 王雅茵
平常作業就已經做到快死掉了，做專題更是覺得自己有超級多不足之處。謝謝組員們的包容與各種指導，讓我接觸到很多網頁服務的技術。雖然能力有限加上做得很累，但還是很開心！

## 如何使用
### Install Docker
至 [Docker.com](https://www.docker.com/)安裝 Docker Desktop 方能接續下列步驟
### Install dependency
```
# ./makeNTU-2023-competition
$ yarn install
```

### Run database
```
# ./makeNTU-2023-competition
$ cd server
$ docker-compose up -d
```

### Reset team account
- Data in `./server/database/data/teams.json`
- 記得要把`.env.defaults`複製到`.env`，否則會跑不動
```
$ yarn database reset
```

### Run backend
```
# ./makeNTU-2023-competition
$ yarn dev-server
```

### Run frontend
```
# ./makeNTU-2023-competition
$ yarn start
```

Goto `http://localhost:3000` to see the website.

## 負責項目
### 徐明晧
- 3D列印機管理系統
  - 後端：後端設計、資料庫設計(schema)、GraphQL設計(mutation、query、subscription的schema與resolver)、建立Apollo Server框架、前後端接口對接
  - 前端：利用React、Material-UI進行排版與各種功能實現、管理介面設計、一般用戶介面設計、建立Apollo Client框架

### 林和毅
- 雷射切割機管理系統
  - 後端：後端部屬、資料傳輸、邏輯規劃、預約排程管理、GraphQL(schema, resolver)撰寫
  - 前端：雷切機台管理頁面UI/UX、管理功能實現

### 王雅茵
- 雷射切割機管理系統
  - 後端：schema跟resolver等等
  - 前端：負責切版以及function，以及前後端資料的接收

## Demo畫面

### 登入介面

- 初始畫面：點選`LOGIN`可以跳轉至登入畫面

![](https://i.imgur.com/z0n1Wzo.png)

- 登入畫面：使用MakeNTU競賽主辦方提供的帳號密碼以登入網站
  - 若有reset dataset的話，預設的管理員帳號密碼為：`0/0`，預設的一般使用者帳號密碼為：`1/1111`

![](https://i.imgur.com/SvSCiZs.png)

- 選單畫面：在此畫面可以選擇要進行雷射切割機或3D列印機的操作

![](https://i.imgur.com/TOS5ly3.png)

### 3D列印機
#### 管理者
- 管理介面：可以看到有三個操作選項，分別是新增機台、清除機台以及清除使用者，另有兩個隊列列出等待中及使用中的使用者，以下會分別介紹這些功能
  - 新增機台按鈕：按下去後會跳出輸入框，可以對於要新增的機台進行資料填寫並回傳
  - 清除機台按鈕：按下去後會跳出警告並請管理員確認是否清除機台，若要清除則會將dataset中的所有機台清空
  - 清除使用者：按下去後會跳警告並請管理員確認是否清除機台，若要清除則會將dataset中的所有使用者清空
  - 等待隊列：顯示已經預約但還沒分發到機台的使用者
  - 使用隊列：顯示已經在使用的使用者

![](https://i.imgur.com/tX0OoUZ.png)

- 新增機台視窗：如圖，需要填寫機台名稱與使用時間，按下新增鍵以確認

![](https://i.imgur.com/h43MEU1.png)

- 呈現機台狀態：新增完成後即會顯示新增的機台，並利用綠色Enable與紅色In Progress來區分使用情形

![](https://i.imgur.com/U5bl9Mh.png)

- 點擊等待隊列下方的小卡片即可安排機台給使用者

![](https://i.imgur.com/8yURKPH.png)

- 安排後該機台會變成In Progress，按下機台卡片下方的結束即可結束該使用者的使用狀態，而刪除鍵則是刪除該機台，同時若該機台有使用者則會變回等待的狀態

![](https://i.imgur.com/K3RIIES.png)

- 操作說明：該按鍵按下去即會顯示簡單的操作說明

![](https://i.imgur.com/Z7V0t9N.png)

#### 使用者
- 登入方式與管理員相同
- 預約畫面：點擊我要預約即會送出預約，同時進入等待狀態

![](https://i.imgur.com/rwhHh08.png)

- 等待狀態會顯示預約成功，此時需等待管理員安排使用機台

![](https://i.imgur.com/KwMjzEC.png)

- 當排到機台時，會顯示使用中，此時可以依照主辦方的規定使用機台

![](https://i.imgur.com/j9QNIaA.png)

### 雷射切割機
#### 管理者
- 機台狀態
  - 準備中/運作中/暫停使用
  - 預計完成：根據使用時間上限計算
  - 狀態按鈕1：待分配/使用完成
  - 狀態按鈕2：暫停使用，使用完成後才能點選（防呆設計）
- 機台管理與排程
  - 排程：可選擇隊伍排入準備中的機台或移除該隊伍
  - 排程後會馬上更新等待列表

![](https://i.imgur.com/n8lQB6h.png)

#### 使用者
- 預約狀態與借用管理（狀態顯示：未預約/已登記借用）
- 等待組數會隨著排程更新改變

![](https://i.imgur.com/wzWBgGJ.png)

### 其他

- 旁邊的drawer可以切換3D列印機或雷射切割機

![](https://i.imgur.com/cStgLyi.png)

