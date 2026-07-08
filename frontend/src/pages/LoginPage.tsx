import {
    useEffect,
    useState,
} from "react";

import type {
    ChangeEvent,
    FormEvent,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import type {
    LoginFormValues,
} from "../types/auth.types";

import {
    validateLogin,
} from "../validators/auth.validator";

import {
    AuthService,
} from "../services/auth.service";

import Input
    from "../components/ui/Input";

import Button
    from "../components/ui/Button";



export default function LoginPage() {

    const navigate =
        useNavigate();

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        const role =
            localStorage.getItem("role");

        if (token) {

        if (role === "OPERATOR") {

            navigate("/operator");

        } else if (role === "TECHNICIAN") {

            navigate("/technician");

        } else {

            navigate("/home");
        }
    }

    }, [navigate]);

    const [formData, setFormData] =
        useState<LoginFormValues>({
            email: "",
            password: "",
        });

    const [errors, setErrors] =
        useState<
            Partial<
                Record<
                    keyof LoginFormValues,
                    string
                >
            >
        >({});

    const [message, setMessage] =
        useState("");

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setMessage("");

        const validationErrors =
            validateLogin(formData);

        setErrors(validationErrors);

        if (
            Object.keys(validationErrors).length > 0
        ) {
            return;
        }

        try {

            setIsSubmitting(true);

            const response =
                await AuthService.login(formData);


            localStorage.setItem(
                "token",
                response.token
            );

            localStorage.setItem(
                "userId",
                response.user.id
            );

            localStorage.setItem(
                "role",
                response.user.role
            );

            localStorage.setItem(
                "firstName",
                response.user.firstName
            );

            setMessage(
                response.message
            );

            if (
                response.user.role ===
                "OPERATOR"
            ) {

                navigate("/operator");

            } else if (
                response.user.role ===
                "TECHNICIAN"
            ) {

                navigate("/technician");

            } else {

                navigate("/home");
            }

        } catch (error: any) {

            setMessage(
                error?.message
                || "Error inesperado"
            );

        } finally {

            setIsSubmitting(false);
        }
    };

    return (
        <div className="
            min-h-screen
            grid
            lg:grid-cols-2
        ">

            <div className="
                bg-[#03152E]
                text-white
                p-8
                lg:p-16
                flex
                flex-col
                justify-center
            ">

                <h1 className="text-5xl font-bold">
                    reporta
                    <span className="text-yellow-400">
                        Ya
                    </span>
                </h1>

                <div className="mt-16">

                    <h2 className="
                        text-3xl
                        lg:text-5xl
                        font-bold
                        leading-tight
                    ">
                        Bienvenido nuevamente
                    </h2>

                    <p className="
  mt-6
  lg:mt-8
  text-lg
  lg:text-2xl
  text-gray-300
">
                        Inicia sesión para continuar.
                    </p>

                </div>

            </div>

            <div className="bg-white flex items-center justify-center">

                <div className="
  w-full
  max-w-xl
  px-6
  lg:px-0
">


                    <div className="
                        flex
                        gap-4
                        mb-8
                        items-center
                        flex-wrap
                    ">

                        <Link
                            to="/login"
                            className="
                                px-6
                                py-2
                                rounded-full
                                bg-[#03152E]
                                text-white
                                font-semibold
                            "
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="
                                px-6
                                py-2
                                rounded-full
                                border
                                font-semibold
                            "
                        >
                            Registrarse
                        </Link>

                        <Link
                            to="/forgot-password"
                            className="
                                px-6
                                py-2
                                rounded-full
                                border
                                font-semibold
                                text-sm
                                hover:bg-gray-100
                            "
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>

                        <Link
                            to="/technician/apply"
                            className="
                                px-6
                                py-2
                                rounded-full
                                border
                                font-semibold
                                text-sm
                                hover:bg-gray-100
                            "
                        >
                            Postular como técnico
                        </Link>
                    </div>

                    <h2 className="text-4xl font-bold text-gray-800 mb-10">
                        Iniciar sesión
                    </h2>

                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit}
                    >

                        <div>

                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Correo electrónico"
                                error={errors.email}
                            />

                        </div>

                        <div>

                            <Input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Contraseña"
                                error={errors.password}
                            />

                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {
                                isSubmitting
                                    ? "Ingresando..."
                                    : "Ingresar"
                            }
                        </Button>

                        {message && (
                            <div className="text-center">
                                {message}
                            </div>
                        )}

                    </form>

                </div>

            </div>

        </div>
    );
}