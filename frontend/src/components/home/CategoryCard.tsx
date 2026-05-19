type Props = {
  title: string;
  reports: number;
  color: string;
};

export default function CategoryCard({
  title,
  reports,
  color,
}: Props) {

  return (

    <div
      className={`
        ${color}
        rounded-2xl
        p-6
        border
      `}
    >

      <h3 className="
        text-2xl
        font-semibold
      ">
        {title}
      </h3>

      <p className="
        mt-2
        text-gray-600
      ">
        {reports} reportes
      </p>

    </div>
  );
}