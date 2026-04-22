import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MessageCircle, Search, UserCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BASE_URL = "http://localhost:8080";

function MessageLists() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  useEffect(() => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }

    const primaryEndpoint =
      currentUser.role === "teacher"
        ? `${BASE_URL}/api/messages/students/${currentUser.id}`
        : `${BASE_URL}/api/messages/teachers/${currentUser.id}`;

    const fallbackEndpoint =
      currentUser.role === "teacher"
        ? `${BASE_URL}/api/teacher/students/${currentUser.id}`
        : null;

    const loadContacts = async () => {
      try {
        const response = await axios.get(primaryEndpoint, { headers });
        setContacts(Array.isArray(response.data) ? response.data : []);
      } catch (primaryError) {
        if (!fallbackEndpoint) {
          console.error("Error fetching contacts:", primaryError);
          setContacts([]);
          return;
        }

        try {
          const response = await axios.get(fallbackEndpoint, { headers });
          const flattened = Array.isArray(response.data)
            ? response.data.flatMap((course) => course.students || [])
            : [];
          const deduped = Array.from(
            new Map(flattened.map((contact) => [contact.id, contact])).values()
          );
          setContacts(deduped);
        } catch (fallbackError) {
          console.error("Error fetching contacts:", fallbackError);
          setContacts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, [currentUser?.id, currentUser?.role, headers]);

  const filteredContacts = contacts.filter((contact) =>
    [contact.name, contact.email, contact.phone]
      .some((value) => String(value || "").toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#082f49_0%,#e0f2fe_60%,#f8fafc_100%)]">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-28">
        <section className="rounded-[34px] border border-white/15 bg-slate-950/75 p-6 text-white shadow-2xl backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">
                Inbox
              </p>
              <h1 className="mt-2 text-3xl font-black">
                {currentUser?.role === "teacher" ? "Student messages" : "Teacher messages"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Open a conversation quickly, keep your contacts organized, and jump back into active chats.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-[22px] bg-white/10 px-4 py-3">
              <Search size={18} className="text-cyan-200" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or phone"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 md:w-72"
              />
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4">
          {loading ? (
            <div className="rounded-[28px] bg-white/80 p-10 text-center text-slate-600 shadow-lg">
              Loading conversations...
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="rounded-[28px] bg-white/80 p-10 text-center text-slate-600 shadow-lg">
              No contacts found yet.
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <Link
                to={`/message/${contact.id}`}
                key={contact.id}
                className="group flex items-center justify-between rounded-[30px] border border-slate-200 bg-white/85 p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  {contact.image || contact.avatar ? (
                    <img
                      src={contact.image || contact.avatar}
                      alt={contact.name}
                      className="h-16 w-16 rounded-[24px] object-cover"
                    />
                  ) : (
                    <UserCircle2 className="h-16 w-16 text-slate-400" />
                  )}
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{contact.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">{contact.email || "No email"}</p>
                    <p className="text-sm text-slate-400">{contact.phone || "No phone"}</p>
                  </div>
                </div>

                <div className="hidden items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 transition group-hover:bg-cyan-600 group-hover:text-white md:inline-flex">
                  <MessageCircle size={16} />
                  Open chat
                </div>
              </Link>
            ))
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default MessageLists;
