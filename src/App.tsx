import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import RecipesPage from "./pages/LastTenRecipes";
import { loader as lastTenRecipesLoader } from './pages/LastTenRecipes';
import { loader as recipesLoader } from './pages/EditRecipes';
import { loader as recipeLoader } from './pages/Recipe';
import { loader as usersLoader } from './pages/EditUsers';
import { loader as userLoader } from './pages/EditUser';
import Layout from "./components/Layout";
import ErrorPage from "./pages/Error";
import EditRecipesPage from "./pages/EditRecipes";
import RecipePage from "./pages/Recipe";
import NewRecipePage from "./pages/AddNewRecipe";
import './App.css'
import Home from "./pages/Home";
import NewUserPage from "./pages/AddNewUser";
import EditUsersPage from "./pages/EditUsers";
import EditRecipe from "./pages/EditRecipe";
import EditUser from "./pages/EditUser";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
      <Route index element={<Home />}></Route>
      <Route path="recipes" >
        <Route index element={<RecipesPage />} loader={lastTenRecipesLoader} />
        <Route path="add" element={<NewRecipePage />} />
        <Route path=":id" element={<RecipePage />} loader={recipeLoader} />
        <Route path="edit" >
          <Route index element={<EditRecipesPage />} loader={recipesLoader}></Route>
          <Route path=":id" element={<EditRecipe />} loader={recipeLoader} />
        </ Route>
      </Route>
      <Route path="/users">
        {/* <Route index element={<UsersPage />} loader={usersLoader} /> */}
        <Route path="add" element={<NewUserPage />} />
        <Route path="edit">
          <Route index element={<EditUsersPage />} loader={usersLoader} />
          <Route path=":id" element={<EditUser />} loader={userLoader} />
        </Route>
      </Route>
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
