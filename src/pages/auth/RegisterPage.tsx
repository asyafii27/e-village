import React, {useState} from React
import {User, Mail, Lock, KeyRound} from "lucide-react"

const RegisterPage: React.FC = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("");
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSUbmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (form.password !== form.confirmPassword) {
            setError("Password tidak sama")
        }

        setTimeout(() => {
            setSuccess("Registrasi berhasil")
        })
    }
}