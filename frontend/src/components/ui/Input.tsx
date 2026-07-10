type Props = {
  type?: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;

  error?: string;
};

export default function Input({
  type = "text",
  name,
  value,
  placeholder,
  onChange,
  error,
}: Props) {

  return (

    <div>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          border
          rounded-xl
          p-4
        "
      />

      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}

    </div>
  );
}