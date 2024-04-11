
import {
    createBrowserRouter, createRoutesFromElements, Route,
} from "react-router-dom";

import Home from "./components/Home";

const handleUpdateItem = (updatedItemData) => {
    // Implement logic to handle the updated item data
    console.log('Item updated:', updatedItemData);
};

const router = createBrowserRouter(
    createRoutesFromElements(
            <Route>
                <Route index element={<Home />} />
                <Route path="Recommendations" element={<Home />} />
            </Route>
    )
);


export default router