/**
 * Định dạng biển số xe (Masking XXY-#####)
 * Hỗ trợ tự động thêm dấu gạch ngang '-' đúng vị trí
 * Ví dụ: 51H12345 -> 51H-12345
 */
export const formatPlate = (value: string): string => {
  if (!value) return "";
  
  // Loại bỏ các ký tự không phải chữ và số, chuyển thành in hoa
  let val = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  // Nếu chỉ toàn số (có thể là mã thẻ ID), trả về nguyên gốc để Backend/Scanner xử lý
  if (/^[0-9]+$/.test(val)) return val;
  
  // Định dạng chuẩn xe máy/ô tô phổ thông (2 số + 1 chữ + 1 số/chữ)
  // Ví dụ: 51H1, 51H
  if (val.length > 4 && /^[0-9]{2}[A-Z][0-9]/.test(val.substring(0, 4))) {
    return val.substring(0, 4) + '-' + val.substring(4, 9);
  } else if (val.length > 3 && /^[0-9]{2}[A-Z]/.test(val.substring(0, 3))) {
    // Ví dụ: 51H, 29A
    return val.substring(0, 3) + '-' + val.substring(3, 8);
  } else if (val.length > 2 && /^[A-Z]{2}/.test(val.substring(0, 2))) {
    // Trường hợp xe quân đội biển đỏ (Ví dụ: QA-1234)
    return val.substring(0, 2) + '-' + val.substring(2, 7);
  }
  
  return val.substring(0, 9);
};
