import { useState } from "react";

import type {
    RegisterFormValues,
} from "../types/auth.types";

import { AuthFactory }
    from "../factories/auth.factory";

import { validateRegister }
    from "../validators/auth.validator";

import { AuthService }
    from "../services/auth.service";

import Input
    from "../components/ui/Input";

import Button from "../components/ui/Button";

import { useEffect } from "react";

import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {

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

            } else {

                navigate("/home");
            }
        }

    }, [navigate]);

    const [formData, setFormData] =
        useState<RegisterFormValues>({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        });

    const [errors, setErrors] =
        useState<
            Partial<
                Record<
                    keyof RegisterFormValues,
                    string
                >
            >
        >({});

    const [message, setMessage] =
        useState("");

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        setMessage("");

        const validationErrors =
            validateRegister(formData);

        setErrors(validationErrors);

        if (
            Object.keys(validationErrors).length > 0
        ) {
            return;
        }

        try {

            setIsSubmitting(true);

            const dto =
                AuthFactory.toRegisterDTO(
                    formData
                );

            const response =
                await AuthService.register(dto);

            setMessage(response.message);

            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
            });

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
                        Únete y ayuda a mejorar tu distrito
                    </h2>

                    <p className="
  mt-6
  lg:mt-8
  text-lg
  lg:text-2xl
  text-gray-300
">
                        Reporta problemas de tu comunidad
                        y haz la diferencia.
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
">

                        <Link
                            to="/login"
                            className="
            px-6
            py-2
            rounded-full
            border
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
            bg-[#03152E]
            text-white
            font-semibold
        "
                        >
                            Registrarse
                        </Link>

                    </div>

                    <h2 className="text-4xl font-bold text-gray-800 mb-10">
                        Crear cuenta
                    </h2>

                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit}
                    >

                        <div className="
  grid
  md:grid-cols-2
  gap-4
">

                            <div>

                                <Input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Nombres"
                                    error={errors.firstName}
                                />

                            </div>

                            <div>

                                <Input
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Apellidos"
                                    error={errors.lastName}
                                />

                            </div>

                        </div>

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

                            <p className="
                                mt-2
                                text-sm
                                text-gray-500
                                leading-relaxed
                            ">
                                La contraseña debe tener mínimo 8 caracteres, una mayúscula,
                                una minúscula, un número y un carácter especial.
                            </p>

                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {
                                isSubmitting
                                    ? "Registrando..."
                                    : "Registrarme"
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