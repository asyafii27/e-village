import React from "react";
import { handlePersuratan } from "../../utils/handlePersuratan";

const SKTMPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-green-700">Persuratan - SKTM</h1>
      <p className="text-gray-600 mb-4">Layanan untuk mengunduh surat keterangan tidak mampu (SKTM).</p>
      <button
        onClick={handlePersuratan}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Generate SKTM PDF
      </button>
    </div>
  );
};

export default SKTMPage;