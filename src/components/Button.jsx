const Button = ({ text, onClick, className = "", ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`px-[16px] rounded-[20px] g2 h-[40px] text-white font-bold text-[14px] cursor-pointer ${className}`}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
