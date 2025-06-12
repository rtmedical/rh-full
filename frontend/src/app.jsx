import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DicomImageList from "./pages/dicomImage/dicomImageList";
import {NavBar} from "./components/NavBar";
import DicomImageForm from "./components/dicomImage/DicomImageForm";
import DicomImageCreate from "./pages/dicomImage/dicomImageCreate";
import ViewDicomImage from "./components/dicomImage/ViewDicomImage";
import DicomImageUpdate from "./pages/dicomImage/dicomImageUpdate";


function App() {
    return (
        <div>
            <Router>
            <NavBar />
                <Routes>
                    <Route path="/" element={<DicomImageList />} />
                    <Route path="/dicom-image/new" element={<DicomImageCreate />}/>
                    <Route path="/dicom-image/update/:id" element={<DicomImageUpdate />}/>
                    <Route path="/dicom-image/:id" element={<ViewDicomImage />}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;