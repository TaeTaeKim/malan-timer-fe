export interface Item {
  name: string;
  id: number;
  price: number;
  type: ItemType;
}

export type ItemType = "hp" | "mp" | "buff" | "etc";

export const hpItems: Item[] = [
  { name: "빨강포션", id: 2000000, price: 150, type: "hp" },
  { name: "주황포션", id: 2000001, price: 150, type: "hp" },
  { name: "하얀포션", id: 2000002, price: 300, type: "hp" },
  { name: "키노코라면(소금)", id: 2022020, price: 550, type: "hp" },
  { name: "키노코라면(돼지사골)", id: 2022019, price: 850, type: "hp" },
  { name: "장어구이", id: 2022003, price: 1100, type: "hp" },
  { name: "키노코라면(구운돼지)", id: 2022018, price: 1600, type: "hp" },
  { name: "쭈쭈바", id: 2001001, price: 2185, type: "hp" },
  { name: "살살녹는 치즈", id: 2020012, price: 4500, type: "hp" },
  { name: "순록의 우유", id: 2020013, price: 5600, type: "hp" },
  { name: "엘릭서", id: 2000004, price: 0, type: "hp" },
  { name: "파워 엘릭서", id: 2000005, price: 0, type: "hp" },
  { name: "빨강포션 알약", id: 2000007, price: 100, type: "hp" },
  { name: "주황포션 알약", id: 2000008, price: 150, type: "hp" },
  { name: "하얀포션 알약", id: 2000009, price: 300, type: "hp" },
];

export const mpItems: Item[] = [
  { name: "파란포션", id: 2000003, price: 200, type: "mp" },
  { name: "레몬", id: 2010004, price: 310, type: "mp" },
  { name: "샐러드", id: 2020000, price: 420, type: "mp" },
  { name: "어묵(꼬치)", id: 2022021, price: 550, type: "mp" },
  { name: "어묵(접시)", id: 2022022, price: 1300, type: "mp" },
  { name: "마나엘릭서", id: 2000006, price: 620, type: "mp" },
  { name: "맑은 물", id: 2022000, price: 1650, type: "mp" },
  { name: "팥빙수", id: 2001002, price: 3800, type: "mp" },
  { name: "새벽의 이슬", id: 2020014, price: 8100, type: "mp" },
  { name: "황혼의 이슬", id: 2020015, price: 10200, type: "mp" },
  { name: "엘릭서", id: 2000004, price: 0, type: "mp" },
  { name: "파워 엘릭서", id: 2000005, price: 0, type: "mp" },
  { name: "파란포션 알약", id: 2000010, price: 200, type: "mp" },
  { name: "마나엘릭서 알약", id: 2000011, price: 620, type: "mp" },
];

export const buffItems: Item[] = [
  { name: "전사의 알약", id: 2002006, price: 500, type: "buff" },
  { name: "타코야끼(문어볼)", id: 2022024, price: 2000, type: "buff" },
  { name: "타코야끼(점보)", id: 2022025, price: 4000, type: "buff" },
  { name: "아기 용의 이유식", id: 2022089, price: 3400, type: "buff" },
  { name: "사이다", id: 2022002, price: 1000, type: "buff" },
  { name: "마법사의 알약", id: 2002007, price: 500, type: "buff" },
  { name: "야끼소바", id: 2022026, price: 1800, type: "buff" },
  { name: "야끼소바(곱배기)", id: 2022027, price: 3800, type: "buff" },
  { name: "통증완화제", id: 2002011, price: 1200, type: "buff" },
  { name: "명사수의 알약", id: 2002008, price: 500, type: "buff" },
  { name: "속도향상의 알약", id: 2002010, price: 500, type: "buff" },
];

export const etcItems: Item[] = [
  { name: "소환의 돌", id: 4006001, price: 5000, type: "etc" },
  { name: "만병통치약", id: 2002011, price: 500, type: "etc" },
  { name: "활전용 청동화살", id: 2060001, price: 10, type: "etc" },
  { name: "활전용 강철화살", id: 2060002, price: 10, type: "etc" },
  { name: "석궁전용 청동화살", id: 2061001, price: 10, type: "etc" },
  { name: "석궁전용 강철화살", id: 2061002, price: 10, type: "etc" },
];
