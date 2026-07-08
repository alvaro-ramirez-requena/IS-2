import {
  useNavigate,
} from "react-router-dom";

type Props = { // Props para el componente CategoryCard, 
  title: string;
  reports: number;
  color: string;
};

export default function CategoryCard({  // Componente para mostrar cada categoría de problema
  title,
  reports,
  color,
}: Props) { //

  const navigate = 
    useNavigate();

  return (

    <div

      onClick={() => //

        navigate( 

          `/reports/problem/${encodeURIComponent(  //sirve 
            title
          )
          }`
        )
      }

      className={`
        ${color}
        rounded-2xl
        p-6
        border
        cursor-pointer
hover:scale-[1.02]
transition
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