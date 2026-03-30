import { CategoryChips } from './CategoryChips';
import { LocationPreview } from './LocationPreview';
import { TypeSelector } from './TypeSelector';

export function AddPinPanel({
  user,
  values,
  errors,
  categories,
  isSubmitting,
  submitError,
  selectedCoordinates,
  onFieldChange,
  onTypeChange,
  onCategoryChange,
  onSubmit,
  onCancel,
  variant = 'page',
  isOpen = true,
  locationPrompt = '',
  onPromptClick,
  submitDisabled = false,
  cancelLabel = 'Cancel & Return',
}) {
  const formId = 'citylayer-add-pin-form';
  const locationReady = Boolean(selectedCoordinates);
  const fieldBaseClass =
    'w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-400/60 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/10';
  const isDrawer = variant === 'drawer';
  const shellClassName = isDrawer
    ? `pointer-events-none fixed inset-y-0 left-0 z-[1001] flex w-full items-start justify-start p-3 pt-20 sm:p-4 sm:pt-24 lg:w-auto lg:p-6 ${isOpen ? '' : 'invisible'}`
    : 'pointer-events-none absolute inset-y-0 right-0 z-30 flex w-full items-center justify-end p-3 pt-20 sm:p-4 sm:pt-24 lg:p-8';
  const panelClassName = isDrawer
    ? `pointer-events-auto flex h-[calc(100vh-7rem)] w-full max-w-[28rem] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/88 shadow-[0_32px_90px_rgba(2,6,23,0.55)] backdrop-blur-2xl transition-all duration-300 ease-out ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-[108%] opacity-0'}`
    : 'pointer-events-auto flex max-h-[calc(100vh-7rem)] w-full max-w-[28rem] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/88 shadow-[0_32px_90px_rgba(2,6,23,0.55)] backdrop-blur-2xl';

  return (
    <div className={shellClassName} aria-hidden={isDrawer && !isOpen}>
      <section className={panelClassName}>
        <div className="border-b border-white/10 px-5 pb-4 pt-5 sm:px-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                {locationReady ? 'Location Selected' : 'Map First Flow'}
              </p>
              <h2 className="font-headline text-[1.75rem] font-extrabold tracking-tight text-white">Create Pin</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                {values.type === 'event' ? 'Event' : 'Place'}
              </div>
              {isDrawer ? (
                <button
                  type="button"
                  className="map-card-icon-button h-10 w-10"
                  aria-label="Close create pin panel"
                  onClick={onCancel}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">close</span>
                </button>
              ) : null}
            </div>
          </div>
          <p className="text-sm leading-6 text-slate-400">
            Click anywhere on the map, review the coordinates, and publish a new {values.type} to CityLayer.
          </p>
          <p className="mt-3 text-xs font-medium text-slate-500">Signed in as {user?.displayName || user?.email}</p>
        </div>

        <form id={formId} className="custom-scrollbar flex grow flex-col gap-7 overflow-y-auto px-5 py-5 sm:px-6" onSubmit={onSubmit}>
          {!locationReady && locationPrompt ? (
            <div className="rounded-[1.35rem] border border-sky-400/20 bg-sky-500/10 p-4 text-sm text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <p className="font-semibold uppercase tracking-[0.2em] text-[11px] text-sky-300">Pick a location</p>
              <p className="mt-2 leading-6 text-slate-300">{locationPrompt}</p>
              {onPromptClick ? (
                <button type="button" className="mt-3 text-sm font-semibold text-sky-300 transition hover:text-sky-200" onClick={onPromptClick}>
                  Use map selection
                </button>
              ) : null}
            </div>
          ) : null}

          <TypeSelector value={values.type} onChange={onTypeChange} />

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-slate-400" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                name="title"
                className={fieldBaseClass}
                placeholder="What's this spot called?"
                type="text"
                value={values.title}
                onChange={onFieldChange}
                disabled={isSubmitting}
              />
              {errors.title ? <p className="field-error mt-2">{errors.title}</p> : null}
            </div>

            <div>
              <label className="mb-2 block text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-slate-400" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className={`${fieldBaseClass} resize-none`}
                placeholder={values.type === 'event' ? 'What should people know before they join?' : 'Tell the community what makes this place worth saving.'}
                rows="4"
                value={values.description}
                onChange={onFieldChange}
                disabled={isSubmitting}
              />
              {errors.description ? <p className="field-error mt-2">{errors.description}</p> : null}
            </div>
          </div>

          <LocationPreview coordinates={selectedCoordinates} error={errors.lat || errors.lng} />

          <CategoryChips categories={categories} value={values.category} onChange={onCategoryChange} />
          {errors.category ? <p className="field-error -mt-4">{errors.category}</p> : null}

          {values.type === 'event' ? (
            <div className="space-y-4 border-t border-white/10 pt-1">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-slate-400" htmlFor="eventDate">
                    Date
                  </label>
                  <input
                    id="eventDate"
                    name="eventDate"
                    className={fieldBaseClass}
                    type="date"
                    value={values.eventDate}
                    onChange={onFieldChange}
                    disabled={isSubmitting}
                  />
                  {errors.eventDate ? <p className="field-error mt-2">{errors.eventDate}</p> : null}
                </div>
                <div>
                  <label className="mb-2 block text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-slate-400" htmlFor="startTime">
                    Time
                  </label>
                  <input
                    id="startTime"
                    name="startTime"
                    className={fieldBaseClass}
                    type="time"
                    value={values.startTime}
                    onChange={onFieldChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {submitError ? <p className="form-error">{submitError}</p> : null}
        </form>

        <div className="border-t border-white/10 px-5 pb-5 pt-4 sm:px-6">
          <button
            type="submit"
            form={formId}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 py-4 text-sm font-bold text-white shadow-[0_20px_45px_rgba(99,102,241,0.35)] transition hover:shadow-[0_24px_55px_rgba(99,102,241,0.42)] active:scale-[0.99]"
            disabled={isSubmitting || submitDisabled}
          >
            <span>{isSubmitting ? 'Creating Pin...' : 'Create Pin'}</span>
            <span className="material-symbols-outlined text-lg" aria-hidden="true">arrow_forward</span>
          </button>
          <button type="button" className="mt-3 w-full py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 transition hover:text-slate-300" onClick={onCancel} disabled={isSubmitting}>
            {cancelLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
