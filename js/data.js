// ─── STATE ───────────────────────────────────────────────────────────────────
let products = [
  {id:1, sku:'SKU-001', name:"Ko'k Jinsi Shim", category:'Shim', price:185000, stock:240, status:'aktiv'},
  {id:2, sku:'SKU-002', name:'Oq Ko\'ylak (Erkak)', category:'Ko\'ylak', price:120000, stock:180, status:'aktiv'},
  {id:3, sku:'SKU-003', name:'Qora Kurtka', category:'Kurtka', price:450000, stock:12, status:'past-zaxira'},
  {id:4, sku:'SKU-004', name:'Yozgi Palto (Ayol)', category:'Palto', price:320000, stock:95, status:'aktiv'},
  {id:5, sku:'SKU-005', name:'Sport Futbolka', category:'Sport kiyim', price:75000, stock:8, status:'past-zaxira'},
  {id:6, sku:'SKU-006', name:'Kashmir Sviter', category:'Ko\'ylak', price:280000, stock:60, status:'aktiv'},
];
let customers = [
  {id:1, name:'Bobur Toshmatov', company:'Fashion Store LLC', phone:'+998901234567', city:'Toshkent', total:12400000, level:'Platinum'},
  {id:2, name:'Malika Yusupova', company:'Style Boutique', phone:'+998991234568', city:'Samarqand', total:8700000, level:'Gold'},
  {id:3, name:'Jasur Rahimov', company:'Trend Magazin', phone:'+998901111222', city:'Namangan', total:5200000, level:'Silver'},
  {id:4, name:'Dilnoza Hamidova', company:'Lady Fashion', phone:'+998931234569', city:'Buxoro', total:3100000, level:'Bronze'},
  {id:5, name:'Sherzod Qodirov', company:'Men\'s Wear', phone:'+998711234570', city:'Andijon', total:9800000, level:'Gold'},
];
let orders = [
  {id:'ORD-001', customer:'Bobur Toshmatov', product:"Ko'k Jinsi Shim", qty:50, total:9250000, date:'2025-06-01', status:'yetkazildi'},
  {id:'ORD-002', customer:'Malika Yusupova', product:'Qora Kurtka', qty:20, total:9000000, date:'2025-06-02', status:'jarayonda'},
  {id:'ORD-003', customer:'Jasur Rahimov', product:'Sport Futbolka', qty:100, total:7500000, date:'2025-06-03', status:'yangi'},
  {id:'ORD-004', customer:'Dilnoza Hamidova', product:'Yozgi Palto', qty:15, total:4800000, date:'2025-06-04', status:'yangi'},
  {id:'ORD-005', customer:'Sherzod Qodirov', product:"Ko'ylak", qty:80, total:9600000, date:'2025-06-05', status:'jarayonda'},
  {id:'ORD-006', customer:'Bobur Toshmatov', product:'Kashmir Sviter', qty:30, total:8400000, date:'2025-05-28', status:'yetkazildi'},
];
