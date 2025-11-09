export function Legend() {
    return (
        <div className="mt-4 flex flex-col items-start gap-4 rounded-lg bg-white p-6 sm:flex-row sm:items-center sm:justify-center sm:gap-8">
            {/* --- Disponible --- */}
            <div className="flex items-center gap-3 text-[0.95rem] text-[#495057]">
                <span className="inline-block h-5 w-5 rounded-full bg-[#52c41a]" />
                <span>Disponible</span>
            </div>

            {/* --- No Disponible --- */}
            <div className="flex items-center gap-3 text-[0.95rem] text-[#495057]">
                <span className="inline-block h-5 w-5 rounded-full bg-[#f5222d]" />
                <span>No Disponible</span>
            </div>

            {/* --- Seleccionado --- */}
            <div className="flex items-center gap-3 text-[0.95rem] text-[#495057]">
                <span className="inline-block h-5 w-5 rounded-full border-2 border-[#0050b3] bg-[#1890ff]" />
                <span>Seleccionado</span>
            </div>
        </div>
    );
}