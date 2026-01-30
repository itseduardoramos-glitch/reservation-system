import { useState } from "react"
import type { User } from "../interfaces/login.model"
import { AuthBaseService } from "../services/auth.service";
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const handleSubmit = async(e: any) => {
        e.preventDefault();

        const user = {
            email: e.target.email.value,
            password: e.target.password.value
        };

        const response = await AuthBaseService.authUser(user.email, user.password);
        if(response.token) {
            localStorage.setItem("token", response.token);
            navigate('/reservations');
        }
    }

    return(
        <div className="card shadow" style={{ width: "22rem" }}>
            <div className="card-body">
                <h5 className="card-title text-center mb-4">Login</h5>
                <form action="" onSubmit={handleSubmit} className="mb-3">
                        <div className="form-group mb-3">
                            <label htmlFor="email">Email:</label>
                            <input type="email" className="form-control" name="email" id="email" />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password">Contraseña:</label>
                            <input type="password" className="form-control" name="password" id="password" />
                        </div>
                        <button className="btn btn-primary" type="submit">Ingresar</button>
                    </form>
            </div>
            
        </div>
    )
}

export default Login