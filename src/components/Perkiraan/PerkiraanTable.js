import React, { useState, useEffect } from "react";
import { BASE_URL, formatDateTable } from "../../utils/Helper";
import axios from "axios";
import { Link } from "react-router-dom";
import { color } from "../../utils/Helper";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ToastComponent from "../ToastComponent";
import jwtDecode from "jwt-decode";

const styles = {
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "20px 0",
  },
  button: {
    backgroundColor: color.primary,
    color: color.white,
    textDecoration: "none",
    "&:hover": {
      backgroundColor: color.secondary,
    },
  },
};

export const PerkiraanTable = (props) => {
  const [perkiraan, setPerkiraan] = useState([]);
  const [perkiraanTemporary, setPerkiraanTemporary] = useState([]);
  const [id, setId] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const [apiResponse, setApiResponse] = useState({});

  const [isLoading, setIsLoading] = useState(true);

  const user = jwtDecode(localStorage.getItem("token"));

  // Modals
  const [show, setShow] = useState(false);

  const config = {
    headers: {
      "Access-Control-Allow-Origin": true,
      "Content-Type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  };

  const handleShow = (id) => {
    setId(id);
    setShow(true);
  };

  useEffect(() => {
    getAllPerkiraan();
  }, []);

  const getAllPerkiraan = async () => {
    setPerkiraanTemporary(Array(3).fill({}));

    let response = await axios.get(`${BASE_URL}/perkiraan`, config);
    setPerkiraan(response.data.data);
    setPerkiraanTemporary(response.data.data);

    setIsLoading(false);
  };

  // SEARCH
  const handleSearch = (e) => {
    let perkiraanSearch = perkiraan.filter((a) =>
      a.nama_perkiraan.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setPerkiraanTemporary(perkiraanSearch);
  };

  // DELETE
  const deletePerkiraan = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/perkiraan/delete/${id}`, config);
      getAllPerkiraan();
    } catch (error) {
      setShowToast(true);
      setApiResponse({
        variant: "danger",
        header: "Error!",
        message:
          error.response.data.code === 403
            ? "Mohon maaf, Anda tidak memiliki hak untuk menghapus data."
            : error.response.data.message,
      });
    }

    handleClose();
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <ToastComponent
        response={apiResponse}
        show={showToast}
        handleClose={() => setShowToast(false)}
      />
      <div className="container">
        {props.type === "dashboard" ? (
          <div style={styles.row}>
            <h3>Tabel Perkiraan</h3>
            <div>
              <Link
                to="/perkiraan"
                className="btn btn-primary me-2 "
                style={styles.button}
                type="button"
              >
                Lihat Tabel Selengkapnya
              </Link>
            </div>
          </div>
        ) : (
          <div style={styles.row}>
            <div>
              {user.role === "ADMIN" && (
                <Link
                  to="/perkiraan/create"
                  className="btn btn-primary me-2 "
                  style={styles.button}
                  type="button"
                >
                  Tambah Perkiraan
                </Link>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Cari nama perkiraan"
                className="form-control"
                onChange={(e) => handleSearch(e)}
              />
            </div>
          </div>
        )}

        <table className="table table-striped">
          <thead>
            {props.type === "dashboard" ? (
              <tr>
                <th scope="col">Tanggal</th>
                <th scope="col">Kode Perkiraan</th>
                <th scope="col">Nama Perkiraan</th>
                <th scope="col">Kelompok Akun</th>
                <th scope="col">Kelompok Laporan</th>
              </tr>
            ) : (
              <tr>
                <th scope="col">Tanggal</th>
                <th scope="col">Kode Perkiraan</th>
                <th scope="col">Nama Perkiraan</th>
                <th scope="col">Kelompok Akun</th>
                <th scope="col">Kelompok Laporan</th>
                {user.role === "ADMIN" && <th scope="col">Aksi</th>}
              </tr>
            )}
          </thead>
          <tbody>
            {perkiraanTemporary.length > 0 ? (
              isLoading ? (
                perkiraanTemporary.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <p className="placeholder-glow">
                        <span className="placeholder col-12 bg-primary"></span>
                      </p>
                    </td>
                    <td>
                      <p className="placeholder-glow">
                        <span className="placeholder col-12 bg-primary"></span>
                      </p>
                    </td>
                    <td>
                      <p className="placeholder-glow">
                        <span className="placeholder col-12 bg-primary"></span>
                      </p>
                    </td>
                    <td>
                      <p className="placeholder-glow">
                        <span className="placeholder col-12 bg-primary"></span>
                      </p>
                    </td>
                    <td>
                      <p className="placeholder-glow">
                        <span className="placeholder col-12 bg-primary"></span>
                      </p>
                    </td>
                    {props.type === "dashboard" ? (
                      <></>
                    ) : (
                      <td>
                        <p className="placeholder-glow">
                          <span className="placeholder col-6 bg-primary"></span>
                        </p>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                perkiraanTemporary.map((a, index) =>
                  props.type === "dashboard" ? (
                    index < 5 && (
                      <tr key={index}>
                        <td>{formatDateTable(a.updatedAt)}</td>
                        <td>{a.kode_perkiraan}</td>
                        <td>{a.nama_perkiraan}</td>
                        <td>{a.kelompok_akun}</td>
                        <td>{a.kelompok_laporan}</td>
                      </tr>
                    )
                  ) : (
                    <tr key={index}>
                      <td>{formatDateTable(a.updatedAt)}</td>
                      <td>{a.kode_perkiraan}</td>
                      <td>{a.nama_perkiraan}</td>
                      <td>{a.kelompok_akun}</td>
                      <td>{a.kelompok_laporan}</td>
                      {user.role === "ADMIN" && (
                        <td>
                          <Link
                            to={`/perkiraan/edit/${a.kode_perkiraan}`}
                            className="btn btn-warning mx-2"
                          >
                            Ubah
                          </Link>
                          <Button
                            variant="danger"
                            onClick={() => handleShow(a.kode_perkiraan)}
                          >
                            Hapus
                          </Button>
                        </td>
                      )}
                    </tr>
                  )
                )
              )
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center"
                  style={{ border: 0, backgroundColor: color.tierary }}
                >
                  Data tidak tersedia
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton className="bg-warning bg-opacity-75">
            <Modal.Title>Perhatian!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Apakah Anda yakin ingin menghapus data ini?</h5>
            <p>
              Data akan terhapus dan perubahan ini tidak dapat dikembalikan
              kemudian.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                deletePerkiraan(id);
              }}
            >
              Iya, benar!
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};
