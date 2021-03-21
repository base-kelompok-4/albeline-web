export function CustomArrow(props) {
  const { className, prev, onClick } = props;
  return (
    <div
      className={className}
      onClick={onClick}
    >
      { prev ? <i class="fas fa-chevron-left"></i> : <i class="fas fa-chevron-right"></i> }
    </div>
  );
}