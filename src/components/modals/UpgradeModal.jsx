import React from 'react';

// =========================================================================================
// 🎨 BỘ CHỌN TEMPLATE NÂNG CẤP (UPGRADE MODAL TEMPLATES)
// -----------------------------------------------------------------------------------------
// Bạn có thể đổi mẫu giao diện bất kỳ lúc nào bằng cách sửa đường dẫn import dưới đây:
//
// Mẫu 1: Bảng giá 4 cột + Cổng thanh toán VietQR / Crypto / License Key
// import ActiveUpgradeTemplate from './upgrade-templates/Template1_GridPricing';
//
// Mẫu 2: Chọn gói Radio 2 cột (Solo $9, Team $19, Enterprise $49) nút cam + tính năng
// import ActiveUpgradeTemplate from './upgrade-templates/Template2_ApidogPlanSelector';
//
// Mẫu 3: Bảng cấu hình & Thanh toán đơn hàng 3 cột (Basic, Pro, Enterprise, On-prem, 
//        thời hạn 1 tháng - 3 năm, số lượng seats, tổng tiền & nút Online Payment / B2B)
// import ActiveUpgradeTemplate from './upgrade-templates/Template3_OrderCheckout';
// =========================================================================================

import ActiveUpgradeTemplate from './upgrade-templates/Template3_OrderCheckout';

export default function UpgradeModal() {
  return <ActiveUpgradeTemplate />;
}