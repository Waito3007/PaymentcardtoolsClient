import { useEffect, useMemo, useState } from "react";
import "./App.css";
import ResultTable from "./components/ResultTable";
import Pagination from "./components/Pagination";
import SummaryCard from "./components/SummaryCard";
import Toolbar from "./components/Toolbar";
import ResultBadge from "./components/ResultBadge";
import { filterDetails, paginate } from "./utils/listing";

const normalizeBase = (value) =>
  value ? value.trim().replace(/\/+$/, "") : "";

const localStorageKey = "paymentcardtools.apiBase";
const localAlgorithmKey = "paymentcardtools.algorithm";
const pageSize = 10;

const algorithms = [
  { value: 1, label: "3DES" },
  { value: 2, label: "DES" },
];

function App() {
  const [apiBase, setApiBase] = useState(() => {
    const saved = localStorage.getItem(localStorageKey);
    return saved || import.meta.env.VITE_API_BASE_URL || "http://localhost:5156";
  });

  const [singleKey, setSingleKey] = useState("");
  const [singleResult, setSingleResult] = useState(null);
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleError, setSingleError] = useState(null);

  const [batchInput, setBatchInput] = useState("");
  const [batchResult, setBatchResult] = useState(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchError, setBatchError] = useState(null);

  const [fileResult, setFileResult] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState(null);

  const [activeTool, setActiveTool] = useState("single");
  const [filterStatus, setFilterStatus] = useState("all");
  const [pageBatchText, setPageBatchText] = useState(1);
  const [pageBatchFile, setPageBatchFile] = useState(1);

  const [algorithm, setAlgorithm] = useState(() => {
    const saved = localStorage.getItem(localAlgorithmKey);
    return saved || import.meta.env.VITE_DEFAULT_ALGORITHM || "1";
  });

  useEffect(() => {
    localStorage.setItem(localStorageKey, apiBase);
  }, [apiBase]);

  useEffect(() => {
    localStorage.setItem(localAlgorithmKey, algorithm);
  }, [algorithm]);

  const baseUrl = useMemo(() => normalizeBase(apiBase || ""), [apiBase]);
  const buildUrl = (path) => `${baseUrl}${path}`;

  const safeJsonFetch = async (url, options) => {
    const response = await fetch(url, options);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || response.statusText);
    }
    return response.json();
  };

  const parseKeys = (raw) =>
    raw
      .split(/[\r\n,;]+/)
      .map((k) => k.trim())
      .filter(Boolean);

  useEffect(() => {
    setPageBatchText(1);
    setPageBatchFile(1);
  }, [filterStatus, batchResult, fileResult]);

  const exportTxt = (details, label) => {
    if (!details?.length) return;
    const content = details.map((d) => d.inputKey).join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `keys-${label}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyText = async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setSingleError(null);
    setSingleResult(null);
    if (!singleKey.trim()) {
      setSingleError("Nhập key trước khi gửi.");
      return;
    }
    setSingleLoading(true);
    try {
      const data = await safeJsonFetch(buildUrl("/api/KeyTools/key"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: singleKey.trim(),
          algorithm: Number(algorithm),
        }),
      });
      setSingleResult(data);
    } catch (err) {
      setSingleError(err.message);
    } finally {
      setSingleLoading(false);
    }
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    setBatchError(null);
    setBatchResult(null);
    const keys = parseKeys(batchInput);
    if (!keys.length) {
      setBatchError("Danh sách key (mỗi dòng hoặc ngăn cách bằng , ;).");
      return;
    }
    setBatchLoading(true);
    try {
      const data = await safeJsonFetch(buildUrl("/api/KeyTools/keys"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys, algorithm: Number(algorithm) }),
      });
      setBatchResult(data);
    } catch (err) {
      setBatchError(err.message);
    } finally {
      setBatchLoading(false);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    setFileError(null);
    setFileResult(null);
    const fileInput = e.target.elements.file;
    const file = fileInput?.files?.[0];
    if (!file) {
      setFileError("Chọn file .txt chứa key (mỗi dòng một key).");
      return;
    }
    setFileLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("algorithm", algorithm);
      const data = await safeJsonFetch(buildUrl("/api/KeyTools/file"), {
        method: "POST",
        body: formData,
      });
      setFileResult(data);
      fileInput.value = "";
    } catch (err) {
      setFileError(err.message);
    } finally {
      setFileLoading(false);
    }
  };

  const renderSingle = () => (
    <div className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow mini">Single</p>
          <h2>Kiểm tra 1 key</h2>
        </div>
      </div>
      <form className="form" onSubmit={handleSingleSubmit}>
        <label>Key (hex 32 hoặc 48 chars)</label>
        <input
          value={singleKey}
          onChange={(e) => setSingleKey(e.target.value)}
          placeholder="0123456789ABCDEFFEDCBA9876543210"
        />
        <button type="submit" disabled={singleLoading}>
          {singleLoading ? "Đang kiểm tra..." : "Kiểm tra"}
        </button>
      </form>
      {singleError && <p className="error">{singleError}</p>}
      {singleResult && (
        <div className="result-card">
          <div className="result-head">
            <span className="mono">{singleResult.inputKey}</span>
            <div className="result-actions">
              <ResultBadge status={singleResult.status} />
              <button
                type="button"
                className="inline-btn"
                onClick={() => copyText(singleResult.inputKey)}
              >
                Copy key
              </button>
            </div>
          </div>
          <p className="muted">{singleResult.message}</p>
          <div className="kcv">
            <span>KCV:</span>
            <span className="mono">{singleResult.kcv || "-"}</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderBatchTextarea = () => {
    const detailsFiltered = filterDetails(batchResult?.details, filterStatus);
    const validList = batchResult?.details?.filter((d) => d.status === 1) || [];
    const invalidList =
      batchResult?.details?.filter((d) => d.status !== 1) || [];
    const { slice, totalPages, safePage } = paginate(
      detailsFiltered,
      pageBatchText,
      pageSize
    );

    return (
      <div className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow mini">Batch</p>
            <h2>Kiểm tra danh sách key</h2>
          </div>
        </div>
        <form className="form" onSubmit={handleBatchSubmit}>
          <label>Danh sách key</label>
          <textarea
            rows={9}
            value={batchInput}
            onChange={(e) => setBatchInput(e.target.value)}
            placeholder="Mỗi dòng 1 key hoặc cách nhau bằng , ;"
          />
          <button type="submit" disabled={batchLoading}>
            {batchLoading ? "Đang kiểm tra..." : "Kiểm tra "}
          </button>
        </form>
        {batchError && <p className="error">{batchError}</p>}
        {batchResult && (
          <>
            <div className="stats">
              <SummaryCard label="Tổng key" value={batchResult.totalKeys} />
              <SummaryCard label="Hợp lệ" value={batchResult.validCount} />
              <SummaryCard label="Không hợp lệ" value={batchResult.invalidCount} />
            </div>
            <Toolbar
              filterStatus={filterStatus}
              onFilterChange={setFilterStatus}
              onExportValid={() => exportTxt(validList, "valid")}
              onExportInvalid={() => exportTxt(invalidList, "invalid")}
              onCopyAll={() =>
                copyText(detailsFiltered.map((d) => d.inputKey).join("\n"))
              }
              disableCopyAll={!detailsFiltered.length}
              disableValid={!validList.length}
              disableInvalid={!invalidList.length}
            />
            <Pagination
              page={safePage}
              totalPages={totalPages}
              onChange={setPageBatchText}
            />
            <ResultTable
              details={slice}
              onCopyRow={(key) => copyText(key)}
            />
          </>
        )}
      </div>
    );
  };

  const renderBatchFile = () => {
    const detailsFiltered = filterDetails(fileResult?.details, filterStatus);
    const validList = fileResult?.details?.filter((d) => d.status === 1) || [];
    const invalidList =
      fileResult?.details?.filter((d) => d.status !== 1) || [];
    const { slice, totalPages, safePage } = paginate(
      detailsFiltered,
      pageBatchFile,
      pageSize
    );

    return (
      <div className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow mini">Batch</p>
            <h2>Qua file .txt</h2>
          </div>
        </div>
        <form className="form" onSubmit={handleFileSubmit}>
          <label>File .txt</label>
          <input type="file" name="file" accept=".txt" />
          <button type="submit" disabled={fileLoading}>
            {fileLoading ? "Dang tai..." : "Upload & Kiem tra"}
          </button>
        </form>
        {fileError && <p className="error">{fileError}</p>}
        {fileResult && (
          <>
            <div className="stats">
              <SummaryCard label="Tổng key" value={fileResult.totalKeys} />
              <SummaryCard label="Hợp lệ" value={fileResult.validCount} />
              <SummaryCard label="Không hợp lệ" value={fileResult.invalidCount} />
            </div>
            <Toolbar
              filterStatus={filterStatus}
              onFilterChange={setFilterStatus}
              onExportValid={() => exportTxt(validList, "valid")}
              onExportInvalid={() => exportTxt(invalidList, "invalid")}
              onCopyAll={() =>
                copyText(detailsFiltered.map((d) => d.inputKey).join("\n"))
              }
              disableCopyAll={!detailsFiltered.length}
              disableValid={!validList.length}
              disableInvalid={!invalidList.length}
            />
            <Pagination
              page={safePage}
              totalPages={totalPages}
              onChange={setPageBatchFile}
            />
            <ResultTable
              details={slice}
              onCopyRow={(key) => copyText(key)}
            />
          </>
        )}
      </div>
    );
  };

  const activePanel = () => {
    if (activeTool === "batch-text") return renderBatchTextarea();
    if (activeTool === "batch-file") return renderBatchFile();
    return renderSingle();
  };

  return (
    <div className="app">
      <div className="layout">
        <aside className="sidebar">
          <div className="brand">
            <p className="eyebrow">PTool</p>
            <h1>Payment Card Tools</h1>
          </div>
          <div className="api-box">
            <label htmlFor="apiBase">API base URL</label>
            <input
              id="apiBase"
              value={apiBase}
              onChange={(e) => setApiBase(e.target.value)}
              placeholder="http://localhost:5156"
            />
          </div>

          <div className="api-box">
            <label>Thuat toan</label>
            <div className="segmented">
              {algorithms.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  className={`segment ${Number(algorithm) === a.value ? "active" : ""}`}
                  onClick={() => setAlgorithm(String(a.value))}
                >
                  {a.label}
                </button>
              ))}
            </div>
            <small>1: 3DES, 2: DES</small>
          </div>

          <div className="nav">
            <p className="nav-label">PEK check</p>
            <div className="nav-group">
              <button
                type="button"
                className={`nav-item ${activeTool === "single" ? "active" : ""}`}
                onClick={() => setActiveTool("single")}
              >
                <span>Check 1 key</span>
                <small>Check thủ công 1 key</small>
              </button>
              <button
                type="button"
                className={`nav-item ${activeTool === "batch-text" ? "active" : ""}`}
                onClick={() => setActiveTool("batch-text")}
              >
                <span>Check nhiều key</span>
                <small>Check nhiều key với text dán vào</small>
              </button>
              <button
                type="button"
                className={`nav-item ${activeTool === "batch-file" ? "active" : ""}`}
                onClick={() => setActiveTool("batch-file")}
              >
                <span>Check key qua file</span>
                <small>Upload file .txt</small>
              </button>
            </div>
          </div>
        </aside>

        <main className="main">{activePanel()}</main>
      </div>
    </div>
  );
}

export default App;




