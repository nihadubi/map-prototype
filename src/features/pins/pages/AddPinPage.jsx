import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../app/providers/useAuth';
import { categoryOptions } from '../constants/pinSchema';
import { AddPinPanel } from '../components/add-pin/AddPinPanel';
import { MapBackground } from '../components/add-pin/MapBackground';
import { useAddPinForm } from '../hooks/useAddPinForm';
import '../styles/addPinPage.css';

export function AddPinPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mapActions, setMapActions] = useState(null);
  const initialCoordinates = useMemo(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
      return null;
    }

    return { lat: Number(lat), lng: Number(lng) };
  }, [searchParams]);

  const {
    values,
    errors,
    isSubmitting,
    submitError,
    selectedCoordinates,
    handleFieldChange,
    handleTypeChange,
    handleCategoryChange,
    handleCoordinateSelect,
    handleSubmit,
  } = useAddPinForm({
    initialCoordinates,
    user,
    onSuccess: async (createdPinId) => {
      navigate(`/?createdPinId=${createdPinId}`);
    },
  });

  return (
    <section className="relative h-screen w-full overflow-hidden bg-slate-100 add-pin-page add-pin-experience">
      <nav className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="pointer-events-auto mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/60 bg-white/80 px-4 py-2.5 shadow-[0_12px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-950 text-sm font-black text-white">CL</div>
            <div>
              <p className="font-headline text-lg font-extrabold tracking-tight text-slate-950">CityLayer</p>
              <p className="hidden text-xs text-slate-500 sm:block">Map-first pin creation</p>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              to="/"
            >
              Discover
            </Link>
            <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-950/20">
              Add Pin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Signed In</p>
              <p className="max-w-[10rem] truncate text-sm font-medium text-slate-700">{user?.displayName || user?.email}</p>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 text-sm font-black text-indigo-700">
              {(user?.displayName || user?.email || 'C').slice(0, 1).toUpperCase()}
            </div>
          </div>
        </div>
      </nav>

      <MapBackground
        selectedCoordinates={selectedCoordinates}
        onCoordinateSelect={handleCoordinateSelect}
        onMapReady={setMapActions}
      />

      <AddPinPanel
        user={user}
        values={values}
        errors={errors}
        categories={categoryOptions}
        isSubmitting={isSubmitting}
        submitError={submitError}
        selectedCoordinates={selectedCoordinates}
        onFieldChange={handleFieldChange}
        onTypeChange={handleTypeChange}
        onCategoryChange={handleCategoryChange}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
        variant="page"
      />

      <div className="pointer-events-none fixed bottom-5 right-4 z-30 flex flex-col gap-3 sm:bottom-6 sm:right-6 add-pin-map-controls">
        <button
          type="button"
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/85 text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.15)] backdrop-blur-md transition hover:bg-white add-pin-map-control"
          onClick={() => mapActions?.zoomIn()}
        >
          <span className="material-symbols-outlined" aria-hidden="true">add</span>
        </button>
        <button
          type="button"
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/85 text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.15)] backdrop-blur-md transition hover:bg-white add-pin-map-control"
          onClick={() => mapActions?.zoomOut()}
        >
          <span className="material-symbols-outlined" aria-hidden="true">remove</span>
        </button>
        <button
          type="button"
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-white shadow-[0_16px_40px_rgba(15,23,42,0.28)] transition hover:bg-slate-800 add-pin-map-control add-pin-map-control-primary"
          onClick={() => mapActions?.locateUser?.()}
        >
          <span className="material-symbols-outlined" aria-hidden="true">my_location</span>
        </button>
      </div>
    </section>
  );
}
