export function ToastrError({ message }: { message: string }) {
  return (
    <span className="flex items-center">
      <span className="toastify-title">Error:</span>
      <span>{message}</span>
    </span>
  );
}

export function ToastrSuccess({ message }: { message: string }) {
  return (
    <span className="flex items-center">
      <span className="toastify-title">Success:</span>
      <span>{message}</span>
    </span>
  );
}
