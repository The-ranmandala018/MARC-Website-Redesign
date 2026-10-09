/** @jsxImportSource preact */
import { useState, useMemo } from "preact/hooks";

// Define the shape of your data based on your Zod schema
interface Publication {
    id: string;
    data: {
        paper_title: string;
        venue: string;
        type: string;
        doi: string;
        publication_date: string;
        authors: string[];
        project?: string;
    };
}

interface Props {
    publications: Publication[];
}

export default function PublicationsList({ publications }: Props) {
    // --- STATE ---
    const [search, setSearch] = useState("");
    const [selectedYear, setSelectedYear] = useState<string>("All");
    const [selectedType, setSelectedType] = useState<string>("All");
    const [selectedProject, setSelectedProject] = useState<string>("All");

    // --- DERIVED DATA (Options for dropdowns) ---
    const years = useMemo(() => {
        const uniqueYears = new Set(
            publications.map((p) =>
                new Date(p.data.publication_date).getUTCFullYear().toString()
            )
        );
        return ["All", ...Array.from(uniqueYears).sort((a, b) => Number(b) - Number(a))];
    }, [publications]);

    const projects = useMemo(() => {
        const uniqueProjects = new Set(
            publications
                .filter((p) => p.data.project)
                .map((p) => p.data.project as string)
        );
        return ["All", ...Array.from(uniqueProjects).sort()];
    }, [publications]);

    const types = ["All", "Journal", "Conference"];

    // --- FILTERING LOGIC ---
    const filteredPubs = useMemo(() => {
        return publications.filter((pub) => {
            const pubYear = new Date(pub.data.publication_date).getUTCFullYear().toString();
            const matchesSearch =
                pub.data.paper_title.toLowerCase().includes(search.toLowerCase()) ||
                pub.data.venue.toLowerCase().includes(search.toLowerCase());
            const matchesYear = selectedYear === "All" || pubYear === selectedYear;
            const matchesType = selectedType === "All" || pub.data.type === selectedType;
            const matchesProject =
                selectedProject === "All" || pub.data.project === selectedProject;

            return matchesSearch && matchesYear && matchesType && matchesProject;
        });
    }, [publications, search, selectedYear, selectedType, selectedProject]);

    // --- GROUPING LOGIC (Applied to filtered results) ---
    const groupedPubs = useMemo(() => {
        // Sort first
        const sorted = [...filteredPubs].sort(
            (a, b) =>
                new Date(b.data.publication_date).getTime() -
                new Date(a.data.publication_date).getTime()
        );

        // Group
        return sorted.reduce((acc, pub) => {
            const year = new Date(pub.data.publication_date).getUTCFullYear();
            if (!acc[year]) acc[year] = [];
            acc[year].push(pub);
            return acc;
        }, {} as Record<number, Publication[]>);
    }, [filteredPubs]);

    const sortedGroupYears = Object.keys(groupedPubs).sort(
        (a, b) => Number(b) - Number(a)
    );

    const hasFilters =
        search !== "" || selectedYear !== "All" || selectedType !== "All" || selectedProject !== "All";

    const resetFilters = () => {
        setSearch("");
        setSelectedYear("All");
        setSelectedType("All");
        setSelectedProject("All");
    };

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });

    return (
        <div class="space-y-10">
            {/* --- CONTROL BAR (glass) --- */}
            <div class="glass-card p-4 sm:p-5">
                <div class="grid grid-cols-1 gap-3 lg:grid-cols-[1.4fr_auto_1fr_0.7fr] lg:items-center">
                    {/* Search */}
                    <label class="relative block">
                        <span class="sr-only">Search publications</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50">
                            <path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" />
                        </svg>
                        <input
                            type="search"
                            class="glass-field !pl-11"
                            placeholder="Search title or venue…"
                            value={search}
                            onInput={(e) => setSearch(e.currentTarget.value)}
                        />
                    </label>

                    {/* Type chips */}
                    <div class="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
                        {types.map((t) => (
                            <button
                                type="button"
                                class="glass-chip !py-2"
                                aria-pressed={String(selectedType === t)}
                                onClick={() => setSelectedType(t)}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* Project */}
                    <select
                        class="glass-field"
                        aria-label="Filter by project"
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.currentTarget.value)}
                    >
                        {projects.map((p) => (
                            <option value={p}>{p === "All" ? "All projects" : p}</option>
                        ))}
                    </select>

                    {/* Year */}
                    <select
                        class="glass-field"
                        aria-label="Filter by year"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.currentTarget.value)}
                    >
                        {years.map((y) => (
                            <option value={y}>{y === "All" ? "All years" : y}</option>
                        ))}
                    </select>
                </div>

                {/* Results count & reset */}
                <div class="mt-4 flex items-center justify-between px-1 text-sm">
                    <span class="text-base-content/60">
                        Showing <strong class="text-base-content">{filteredPubs.length}</strong>{" "}
                        {filteredPubs.length === 1 ? "publication" : "publications"}
                    </span>
                    {hasFilters && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            class="font-semibold text-[#004AAD] hover:underline dark:text-[#5170FF]"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            {/* --- RESULTS --- */}
            {filteredPubs.length === 0 ? (
                <div class="glass-card px-6 py-16 text-center">
                    <p class="text-lg font-semibold text-base-content">No publications match these filters.</p>
                    <button type="button" onClick={resetFilters} class="glass-chip mt-5">
                        Reset all
                    </button>
                </div>
            ) : (
                <div class="space-y-14">
                    {sortedGroupYears.map((year) => (
                        <section class="grid gap-5 lg:grid-cols-[160px_1fr] lg:gap-10">
                            {/* Year marker */}
                            <div class="lg:sticky lg:top-28 lg:self-start">
                                <h2 class="font-display text-5xl text-gradient lg:text-6xl">{year}</h2>
                                <p class="mt-2 text-sm text-base-content/55">
                                    {groupedPubs[Number(year)].length}{" "}
                                    {groupedPubs[Number(year)].length === 1 ? "paper" : "papers"}
                                </p>
                            </div>

                            <div class="space-y-4">
                                {groupedPubs[Number(year)].map((pub) => (
                                    <article class="glass-card glass-hover !rounded-3xl p-5 sm:p-6">
                                        <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                            <div class="min-w-0 flex-1">
                                                <div class="flex flex-wrap items-center gap-2 text-xs">
                                                    <span
                                                        class={`rounded-full px-2.5 py-1 font-semibold uppercase tracking-wider ${
                                                            pub.data.type === "Journal"
                                                                ? "bg-[#004AAD]/10 text-[#004AAD] dark:bg-[#5170FF]/15 dark:text-[#9fb0ff]"
                                                                : "bg-[#7C0E24]/10 text-[#7C0E24] dark:bg-[#f3dfe4]/10 dark:text-[#f3dfe4]"
                                                        }`}
                                                    >
                                                        {pub.data.type}
                                                    </span>
                                                    <span class="tabular-nums text-base-content/50">
                                                        {formatDate(pub.data.publication_date)}
                                                    </span>
                                                    {pub.data.project && (
                                                        <span class="text-base-content/50">· {pub.data.project}</span>
                                                    )}
                                                </div>

                                                <h3 class="mt-3 text-lg font-semibold leading-snug text-base-content">
                                                    <a
                                                        href={pub.data.doi}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        class="transition-colors hover:text-[#004AAD] dark:hover:text-[#5170FF]"
                                                    >
                                                        {pub.data.paper_title}
                                                    </a>
                                                </h3>

                                                <p class="mt-1.5 text-sm italic text-base-content/75">
                                                    {pub.data.venue.trim()}
                                                </p>

                                                <p class="mt-2 text-sm leading-relaxed text-base-content/60">
                                                    {pub.data.authors.join(", ")}
                                                </p>
                                            </div>

                                            <div class="shrink-0">
                                                <a
                                                    href={pub.data.doi}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    class="glass-chip !py-2 text-xs font-semibold"
                                                >
                                                    Read paper
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 17 17 7M9 7h8v8" />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}
