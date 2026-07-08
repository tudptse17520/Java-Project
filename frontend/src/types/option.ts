// ---------------------------------------------
// Option Type
// Kiểu dữ liệu cho dropdown/select chung
// ---------------------------------------------

export interface Option<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}
