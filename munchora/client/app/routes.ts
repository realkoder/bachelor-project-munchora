import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";


// Remember to add no-auth routes to client/app/components/AuthBootstrapper.tsx

export default [
    layout("layout/layoutNavbar.tsx", [
        index("routes/index.tsx"),
        route("about", "routes/about.tsx"),
        route("admin", "routes/admin.tsx"),
        route("faq", "routes/faq.tsx"),
        route("feedback", "routes/feedback.tsx"),
        route("grocery-lists", "routes/grocery-lists.tsx"),
        route("grocery-list/:listId", "routes/grocery-list-detail.tsx"),
        route("home", "routes/home.tsx"),
        route("profile", "routes/profile.tsx"),
        route("privacy", "routes/privacy.tsx"),
        route("recipe/:recipeId", "routes/recipe.tsx"),
        route("recipes", "routes/recipes.tsx"),
        route("sign-in", "routes/sign-in.tsx"),
        route("terms", "routes/terms.tsx"),
    ]),
] satisfies RouteConfig;
