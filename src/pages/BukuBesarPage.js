import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JurnalUmumTable from "../components/JurnalUmum/JurnalUmumTable";
import { color, formatDate } from "../utils/Helper";
import {
  getAllJurnal,
  getAllPerkiraan,
  getJurnalByDate,
  getJurnalByKodePerkiraan,
  getJurnalPDF,
  getJurnalPDFByDate,
  getJurnalPDFByKodePerkiraan,
} from "../utils/Provider";

const styles = {
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    margin: "10px 0",
    border: `1px solid #8da9fc`,
    borderRadius: "10px",
    minHeight: "102px",
    position: "relative",
  },
  floatText: {
    position: "absolute",
    top: -13,
    left: 15,
    backgroundColor: color.tierary,
    padding: "0 5px",
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

function BukuBesarPage() {
  const [jurnalList, setJurnalList] = useState([]);
  const [perkiraanList, setPerkiraanList] = useState([]);
  const [total, setTotal] = useState({
    totalDebet: 0,
    totalKredit: 0,
  });

  const [filterValue, setFilterValue] = useState({});
  const [searchPerkiraan, setSearchPerkiraan] = useState("");
  const [checked, setChecked] = useState({
    bulanan: false,
    tahunan: false,
  });

  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const config = {
    headers: {
      "Access-Control-Allow-Origin": true,
      "Content-Type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  };

  const getJurnalList = async () => {
    let response = "";
    let date = new Date();

    if (Object.keys(filterValue).length > 0) {
      if (filterValue.filterPeriode === "bulanan") {
        date = `${date.getFullYear()}/${date.getMonth() + 1}`;
      } else if (filterValue.filterPeriode === "tahunan") {
        date = date.getFullYear();
      } else {
        date = new Date(filterValue.filterPeriode);
        date = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      }

      response = await getJurnalByDate(date, config);

      if (response.code !== 200) {
        setJurnalList({});
        setTotal({
          totalDebet: 0,
          totalKredit: 0,
        });
      } else {
        setTotal({
          totalDebet: response.totalDebet,
          totalKredit: response.totalKredit,
        });
        setJurnalList(response.data);
      }
    } else if (searchPerkiraan.length > 0) {
      response = await getJurnalByKodePerkiraan(searchPerkiraan, config);
      if (response.code !== 200) {
        setJurnalList({});
        setTotal({
          totalDebet: 0,
          totalKredit: 0,
        });
      } else {
        setTotal({
          totalDebet: response.totalDebet,
          totalKredit: response.totalKredit,
        });
        setJurnalList(response.data);
      }
    } else {
      response = await getAllJurnal(config);
      if (response.code !== 200) {
        setJurnalList({});
        setTotal({
          totalDebet: 0,
          totalKredit: 0,
        });
      } else {
        setTotal({
          totalDebet: response.totalDebet,
          totalKredit: response.totalKredit,
        });
        setJurnalList(response.data);
      }
    }
    setIsLoading(false);
  };

  const getPerkiraanList = async () => {
    let response = await getAllPerkiraan(config);
    setPerkiraanList(response.data);
  };

  useEffect(() => {
    getJurnalList();
    getPerkiraanList();
  }, [filterValue, searchPerkiraan]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "searchPerkiraan") {
      setSearchPerkiraan(value);
    } else {
      value === "bulanan"
        ? setChecked((prev) => ({ ...prev, bulanan: true }))
        : setChecked((prev) => ({ ...prev, tahunan: true }));

      setFilterValue((values) => ({ ...values, [name]: value }));
    }
  };

  const clearFilter = () => {
    setFilterValue({});
    setSearchPerkiraan("");
    setChecked({
      tahunan: false,
      bulanan: false,
    });
  };

  const downloadPDF = async () => {
    let response = "";
    let date = new Date();

    if (Object.keys(filterValue).length > 0) {
      if (filterValue.filterPeriode === "bulanan") {
        date = `${date.getFullYear()}/${date.getMonth() + 1}`;
        response = await getJurnalPDFByDate(date);
      } else if (filterValue.filterPeriode === "tahunan") {
        date = date.getFullYear();
        response = await getJurnalPDFByDate(date);
      } else {
        date = new Date(filterValue.filterPeriode);
        date = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        response = await getJurnalPDFByDate(date);
      }
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `LAPORAN-BUKU_BESAR-ACCOUTNING-${date}.pdf`
        );
        document.body.appendChild(link);
        link.click();
      }
    } else if (searchPerkiraan.length > 0) {
      response = await getJurnalPDFByKodePerkiraan(searchPerkiraan);
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `LAPORAN-BUKU_BESAR-ACCOUNTING-${searchPerkiraan}.pdf`
        );
        document.body.appendChild(link);
        link.click();
      } else {
        console.log(response);
      }
    } else {
      response = await getJurnalPDF();
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `LAPORAN-BUKU_BESAR-ACCOUNTING.pdf`);
        document.body.appendChild(link);
        link.click();
      }
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="row" style={styles.row}>
            <div>
              <h5 style={styles.floatText}>Filter</h5>
            </div>
            <div className="col">
              <label>Kode Perkiraan</label>
              <select
                className="form-select form-select-sm"
                name="searchPerkiraan"
                value={searchPerkiraan || ""}
                onChange={handleChange}
              >
                <option value="">Pilih Perkiraan</option>
                {perkiraanList.map((item) => (
                  <option value={item.kode_perkiraan} key={item.kode_perkiraan}>
                    {`${item.kode_perkiraan} - ${item.nama_perkiraan}`}
                  </option>
                ))}
              </select>

              <button
                className="btn btn-sm btn-warning mt-3"
                onClick={clearFilter}
              >
                Hapus Filter
              </button>
            </div>
            <div className="col">
              <label>Periode</label>
              <input
                type="date"
                className="form-control form-control-sm"
                name="filterPeriode"
                value={
                  filterValue.filterPeriode
                    ? formatDate(filterValue.filterPeriode)
                    : formatDate(new Date())
                }
                onChange={handleChange}
              />
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="filterPeriode"
                  value="bulanan"
                  id="filterMonth"
                  onChange={handleChange}
                  checked={checked.bulanan}
                />
                <label className="form-check-label" htmlFor="filterMonth">
                  Bulanan
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="filterPeriode"
                  value="tahunan"
                  id="filterYear"
                  onChange={handleChange}
                  checked={checked.tahunan}
                />
                <label className="form-check-label" htmlFor="filterYear">
                  Tahunan
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="row pt-4" style={styles.row}>
            <div>
              <h5 style={styles.floatText}>Laporan Buku Besar</h5>
            </div>
            <div className="col">
              <h6>Total Debit</h6>
              {isLoading ? (
                <p className="placeholder-glow">
                  <span className="placeholder col-12 bg-primary"></span>
                </p>
              ) : (
                <h5>{`Rp${total.totalDebet.toLocaleString("id")}`}</h5>
              )}
            </div>
            <div className="col">
              <h6>Total Kredit</h6>
              {isLoading ? (
                <p className="placeholder-glow">
                  <span className="placeholder col-12 bg-primary"></span>
                </p>
              ) : (
                <h5>{`Rp${total.totalKredit.toLocaleString("id")}`}</h5>
              )}
            </div>
            <div className="col">
              <h6>Total Saldo</h6>
              {isLoading ? (
                <p className="placeholder-glow">
                  <span className="placeholder col-12 bg-primary"></span>
                </p>
              ) : (
                <h5>{`Rp${(total.totalDebet - total.totalKredit).toLocaleString(
                  "id"
                )}`}</h5>
              )}
            </div>
            <button
              className="btn btn-sm mt-2"
              style={styles.button}
              onClick={downloadPDF}
            >
              Cetak Laporan
            </button>
          </div>
        </div>
      </div>
      <div>
        <JurnalUmumTable
          jurnalList={isLoading ? Array(3).fill({}) : jurnalList}
          navigate={navigate}
          isBukuBesar={true}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default BukuBesarPage;
