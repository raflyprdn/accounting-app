import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/app-logo.svg";

function Sidebar({ user }) {
  const [path, setPath] = useState("/");

  useEffect(() => {
    setPath(window.location.pathname);
  }, [window.location.pathname]);

  return (
    <div>
      <nav className="navbar">
        <div className="container-fluid mt-3">
          <div className="navbar-brand mx-4 h1 flex" href="#">
            <img src={logo} alt="Logo" style={{ margin: "0px 5px" }} />
            <span style={{ color: "#4d3fa6" }}>AccountJuco</span>
          </div>
        </div>
      </nav>
      <div className="container">
        <div className="row my-4 mx-4">
          <Link
            className={
              path === "/"
                ? "h6 side-hover text-center py-2 active-sidebar"
                : "h6 side-hover text-center py-2"
            }
            to="/"
          >
            Dashboard
          </Link>
          <h6 className="h5" style={{ padding: 0, color: "#4d3fa6" }}>
            Laporan
          </h6>
          <hr />
          <Link
            className={
              path.includes("/buku-besar")
                ? "h6 side-hover text-center py-2 active-sidebar"
                : "h6 side-hover py-2"
            }
            to="/buku-besar"
          >
            {" "}
            Buku Besar
          </Link>
          <Link
            className={
              path.includes("/Laba-rugi")
                ? "h6 side-hover text-center py-2 active-sidebar"
                : "h6 side-hover py-2"
            }
            to="/Laba-rugi"
          >
            Laba Rugi
          </Link>
          <Link
            className={
              path.includes("/neraca-saldo")
                ? "h6 side-hover text-center py-2 active-sidebar"
                : "h6 side-hover py-2"
            }
            to="/neraca-saldo"
          >
            Neraca Saldo
          </Link>
          <Link
            className={
              path.includes("/arus-kas")
                ? "h6 side-hover text-center py-2 active-sidebar"
                : "h6 side-hover py-2"
            }
            to="/arus-kas"
          >
            Arus Kas
          </Link>
          <h6 className="h5" style={{ padding: 0, color: "#4d3fa6" }}>
            Master
          </h6>
          <hr />
          <Link
            className={
              path.includes("/perkiraan")
                ? "h6 side-hover text-center py-2 active-sidebar"
                : "h6 side-hover py-2"
            }
            to="/perkiraan"
          >
            Perkiraan
          </Link>
          <Link
            className={
              path.includes("/jurnal-umum")
                ? "h6 side-hover text-center py-2 active-sidebar"
                : "h6 side-hover py-2"
            }
            to="/jurnal-umum"
          >
            Jurnal Umum
          </Link>
          {user.role === "ADMIN" && (
            <>
              <Link
                className={
                  path.includes("/master-user")
                    ? "h6 side-hover text-center py-2 active-sidebar"
                    : "h6 side-hover py-2"
                }
                to="/master-user"
              >
                User
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
