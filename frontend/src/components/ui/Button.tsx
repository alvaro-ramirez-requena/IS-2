type Props = {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

export default function Button({ children, type = "button", disabled = false, onClick }: Props) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="
        w-full
        bg-blue-700
        hover:bg-blue-800
        text-white
        py-4
        rounded-xl
        font-semibold
        text-lg
        transition
      "
    >
      {children}
    </button>
  );
}
