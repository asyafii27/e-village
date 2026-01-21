const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";


export function handlePersuratan() {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage

    if (!token) {
        console.error("Token not found in localStorage");
        alert("Token tidak ditemukan. Silakan login kembali.");
        return;
    }

    console.log("Token found:", token); // Log the token for debugging

    fetch(`${API_BASE_URL}/test-print/generate-test-print-pdf`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            console.log("Response headers:", response.headers);
            return response.blob();
        })
        .then((blob) => {
            if (blob.type !== "application/pdf") {
                throw new Error("The fetched file is not a valid PDF.");
            }
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = "sktm-print.pdf";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
            alert("Failed to download the PDF. Please check the server response.");
        });
}