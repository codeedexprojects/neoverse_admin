
export const ROUTES = {
DASHBOARD: "/dashboard",
LOGIN : "/",
BOT : "/bot-list",
ADMIN_TREE : "/admin-tree",
GETPROFILE: "/profiles",
WITHDRAWAL: "/withdrawals",
NOTE: "/note-list",
INVESTMENT: "/investment",
INVESTMENT_WITHDRAWAL: "/investment-withdrawal",

}

export const BASE_URL = "https://neoverse-backend.onrender.com"

export const API_ENDOPOINTS = {
LOGIN: `${BASE_URL}/admin/auth/login`,
BOT: `${BASE_URL}/admin/bot`,
ADMIN_TREE: `${BASE_URL}/admin/profile/tree`,
GETPROFILE: `${BASE_URL}/admin/profile`,
WITHDRAWAL: `${BASE_URL}/admin/withdrawal`,
NOTE: `${BASE_URL}/admin/note`,
INVESTMENT: `${BASE_URL}/admin/investment`,
INVESTMENT_WITHDRAWAL: `${BASE_URL}/admin/investmentwithdrawal`,
}