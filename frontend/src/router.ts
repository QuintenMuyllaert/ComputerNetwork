import Index from "./pages/index.svelte";
import Portfolio from "./pages/portfolio.svelte";

const routes = [
	{
		name: "/",
		component: Index,
	},
	{
		name: "/portfolio",
		component: Portfolio,
	},
];

export default routes;
