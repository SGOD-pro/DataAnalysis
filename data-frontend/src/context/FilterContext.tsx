"use client";

import React, {
  createContext,
  useReducer,
  useRef,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { useSyncExternalStore } from "react";

// ---------------- Types ----------------
export type FilterRule = {
  id: string;
  column: string;
  operator: string;
  value: any;
  type: string;
  preview?: boolean;
  applied?: boolean;
};

export type State = {
  filters: FilterRule[];

  appliedTransformations: { column: string; transformations: string[] }[];

  filteredData: any[];
  originalRows: number;
  selectedGrouping: string[];
  groupingPreview: string;
  appliedGrouping: boolean;
};

type Action =
  | { type: "ADD_FILTER"; payload: FilterRule }
  | { type: "REMOVE_FILTER"; payload: string }
  | {
      type: "UPDATE_FILTER";
      payload: { id: string; field: keyof FilterRule; value: any };
    }
  | { type: "SET_FILTERS"; payload: FilterRule[] }
  | { type: "CLEAR_FILTERS" }
  | { type: "TOGGLE_PREVIEW"; payload: string }
  | { type: "APPLY_FILTER"; payload: string }
  | { type: "APPLY_FILTERS" }
  | {
      type: "SET_TRANSFORMATIONS";
      payload: { column: string; transformations: string[] }[];
    }
  | {
      type: "ADD_TRANSFORMATION";
      payload: { column: string; transformation: string };
    }
  | { type: "SET_GROUPING"; payload: string[] }
  | { type: "APPLY_GROUPING" }
  | { type: "SET_GROUPING_PREVIEW"; payload: string };

// ---------------- Reducer ----------------
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_FILTER":
      return { ...state, filters: [...state.filters, action.payload] };

    case "REMOVE_FILTER":
      return {
        ...state,
        filters: state.filters.filter((f) => f.id !== action.payload),
      };

    case "UPDATE_FILTER":
      return {
        ...state,
        filters: state.filters.map((f) =>
          f.id === action.payload.id
            ? { ...f, [action.payload.field]: action.payload.value }
            : f
        ),
      };

    case "SET_FILTERS":
      return { ...state, filters: action.payload };

    case "CLEAR_FILTERS":
      return { ...state, filters: [], filteredData: state.filteredData };

    case "TOGGLE_PREVIEW":
      return {
        ...state,
        filters: state.filters.map((f) =>
          f.id === action.payload ? { ...f, preview: !f.preview } : f
        ),
      };

    case "APPLY_FILTER":
      return {
        ...state,
        filters: state.filters.map((f) =>
          f.id === action.payload ? { ...f, applied: true, preview: false } : f
        ),
      };

    case "APPLY_FILTERS":
      return {
        ...state,
        filters: state.filters.map((f) => ({
          ...f,
          applied: true,
          preview: false,
        })),
      };

    case "SET_TRANSFORMATIONS":
      return { ...state, appliedTransformations: action.payload };

    case "ADD_TRANSFORMATION":
      return {
        ...state,
        appliedTransformations: state.appliedTransformations
          .map((t) =>
            t.column === action.payload.column
              ? {
                  ...t,
                  transformations: [
                    ...t.transformations,
                    action.payload.transformation,
                  ],
                }
              : t
          )
          .concat(
            state.appliedTransformations.some(
              (t) => t.column === action.payload.column
            )
              ? []
              : [
                  {
                    column: action.payload.column,
                    transformations: [action.payload.transformation],
                  },
                ]
          ),
      };

    case "SET_GROUPING":
      return { ...state, selectedGrouping: action.payload };

    case "APPLY_GROUPING":
      return { ...state, appliedGrouping: true };

    case "SET_GROUPING_PREVIEW":
      return { ...state, groupingPreview: action.payload };

    default:
      return state;
  }
};

// ---------------- Initial State ----------------
// Keep a small default; you can update filteredData/originalRows later from your zustand store.
const INITIAL_STATE: State = {
  filters: [],
  appliedTransformations: [],
  filteredData: [],
  originalRows: 0,
  selectedGrouping: [],
  groupingPreview: "",
  appliedGrouping: false,
};

// ---------------- Observable store (for fine-grained subscriptions) ----------------
// We'll keep an internal listener set and expose `subscribe()` so useSyncExternalStore can use it.
type Listener = () => void;

// ---------------- Context Provider ----------------
export function FilterProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: Partial<State>;
}) {
  // allow caller to pass initialState (e.g., from zustand or SSR)
  const mergedInitial = { ...INITIAL_STATE, ...(initialState ?? {}) };
  const [state, dispatch] = useReducer(reducer, mergedInitial);

  // mutable ref to latest state (so selectors used by useSyncExternalStore read latest)
  const stateRef = useRef<State>(state);
  stateRef.current = state;

  // listeners set
  const listenersRef = useRef<Set<Listener>>(new Set());

  const subscribe = useCallback((listener: Listener) => {
    listenersRef.current.add(listener);
    return () => listenersRef.current.delete(listener);
  }, []);

  const notify = useCallback(() => {
    for (const l of Array.from(listenersRef.current)) {
      try {
        l();
      } catch (e) {
        // swallow listener errors so one bad listener doesn't break others
        // optionally log in dev
      }
    }
  }, []);

  // Wrap dispatch to notify subscribers after state updates
  const dispatchAndNotify = useCallback(
    (action: Action) => {
      // do synchronous update via reducer
      dispatch(action);
      // notify after microtask so stateRef is updated (React has updated stateRef in render; but to be safe we schedule notify)
      // Using setTimeout(..., 0) would be async; instead use Promise.resolve().then(...)
      Promise.resolve().then(() => notify());
    },
    [notify]
  );

  // ---------------- Action helpers (memoized) ----------------
  // These are stable functions to be used by components; because they are stable, using them in props won't cause re-renders.
  const addFilter = useCallback(() => {
    const newFilter: FilterRule = {
      id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      column: "",
      operator: "",
      value: "",
      type: "numeric",
      preview: false,
      applied: false,
    };
    dispatchAndNotify({ type: "ADD_FILTER", payload: newFilter });
  }, [dispatchAndNotify]);

  const removeFilter = useCallback(
    (id: string) => {
      dispatchAndNotify({ type: "REMOVE_FILTER", payload: id });
    },
    [dispatchAndNotify]
  );

  const updateFilter = useCallback(
    (id: string, field: keyof FilterRule, value: any) => {
      dispatchAndNotify({
        type: "UPDATE_FILTER",
        payload: { id, field, value },
      });
    },
    [dispatchAndNotify]
  );

  const setFilters = useCallback(
    (filters: FilterRule[]) => {
      dispatchAndNotify({ type: "SET_FILTERS", payload: filters });
    },
    [dispatchAndNotify]
  );

  const clearFilters = useCallback(() => {
    dispatchAndNotify({ type: "CLEAR_FILTERS" });
  }, [dispatchAndNotify]);

  const togglePreview = useCallback(
    (id: string) => {
      dispatchAndNotify({ type: "TOGGLE_PREVIEW", payload: id });
    },
    [dispatchAndNotify]
  );

  const applyFilterSingle = useCallback(
    (id: string) => {
      const filter = stateRef.current.filters.find((f) => f.id === id);
      console.log("filter", filter);
      dispatchAndNotify({ type: "APPLY_FILTER", payload: id });
    },
    [dispatchAndNotify]
  );

  const applyFilters = useCallback(() => {
    dispatchAndNotify({ type: "APPLY_FILTERS" });
  }, [dispatchAndNotify]);

  const setTransformations = useCallback(
    (t: { column: string; transformations: string[] }[]) => {
      dispatchAndNotify({ type: "SET_TRANSFORMATIONS", payload: t });
    },
    [dispatchAndNotify]
  );

  const addTransformation = useCallback(
    (column: string, transformation: string) => {
      dispatchAndNotify({
        type: "ADD_TRANSFORMATION",
        payload: { column, transformation }, // ✅ no array
      });
    },
    [dispatchAndNotify]
  );

  const setGrouping = useCallback(
    (cols: string[]) => {
      dispatchAndNotify({ type: "SET_GROUPING", payload: cols });
    },
    [dispatchAndNotify]
  );

  const applyGrouping = useCallback(() => {
    dispatchAndNotify({ type: "APPLY_GROUPING" });
  }, [dispatchAndNotify]);

  const setGroupingPreview = useCallback(
    (preview: string) => {
      dispatchAndNotify({ type: "SET_GROUPING_PREVIEW", payload: preview });
    },
    [dispatchAndNotify]
  );

  // non-state helpers (pure side-effects or to integrate with other stores)
  const saveTransformations = useCallback(() => {
    // placeholder - keep side-effect here (e.g., persist to backend or update zustand)
    // console.log("saveTransformations", stateRef.current.appliedTransformations);
  }, []);

  const previewTransformations = useCallback(() => {
    // placeholder for preview behavior
  }, []);

  const previewGrouping = useCallback(() => {
    // placeholder for previewing grouping (could compute groupingPreview and call setGroupingPreview)
  }, []);

  const saveGrouping = useCallback(() => {
    // placeholder for persisting grouping config
  }, []);

  // Expose a stable actions object (memoized)
  const actions = useMemo(
    () => ({
      addFilter,
      removeFilter,
      updateFilter,
      setFilters,
      clearFilters,
      togglePreview,
      applyFilterSingle,
      applyFilters,
      setTransformations,
      addTransformation,
      setGrouping,
      applyGrouping,
      setGroupingPreview,
      saveTransformations,
      previewTransformations,
      previewGrouping,
      saveGrouping,
      // also expose raw dispatch if needed for advanced cases
      dispatch: dispatchAndNotify,
    }),
    [
      addFilter,
      removeFilter,
      updateFilter,
      setFilters,
      clearFilters,
      togglePreview,
      applyFilterSingle,
      applyFilters,
      setTransformations,
      addTransformation,
      setGrouping,
      applyGrouping,
      setGroupingPreview,
      saveTransformations,
      previewTransformations,
      previewGrouping,
      saveGrouping,
      dispatchAndNotify,
    ]
  );

  // Provider renders a lightweight context used only to give actions/subscription (not the whole state)
  // We'll expose a tiny context just to carry subscribe/getSnapshot and actions.
  // But for simplicity we'll still render children directly.
  const contextValue = useMemo(
    () => ({ subscribe, getSnapshot: () => stateRef.current, actions }),
    [subscribe, actions]
  );

  // note: We don't actually need to provide this context via React.createContext for selectors;
  // but we expose it to allow components to get actions via a hook below.

  return (
    // We use a real React Context only for actions to allow fallback backward compatibility
    <FilterInternalContextProvider value={contextValue}>
      {children}
    </FilterInternalContextProvider>
  );
}

// ---------------- Internal actions/context holder ----------------
// We expose a minimal context to store subscribe/getSnapshot/actions
const FilterInternalContext = React.createContext<{
  subscribe: (l: Listener) => () => void;
  getSnapshot: () => State;
  actions: ReturnType<typeof createActionsPlaceholder>;
} | null>(null);

// helper to strongly type actions placeholder (ts helper)
function createActionsPlaceholder() {
  return {} as any;
}

function FilterInternalContextProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: any;
}) {
  return (
    <FilterInternalContext.Provider value={value}>
      {children}
    </FilterInternalContext.Provider>
  );
}

// ---------------- Public hooks ----------------

/**
 * useFilterSelector
 * Subscribe to a slice of state using a selector function.
 * The component will re-render only when the selector result changes (strict equality).
 *
 * Example:
 * const filters = useFilterSelector(s => s.filters);
 */
export function useFilterSelector<T>(selector: (s: State) => T) {
  const ctx = React.useContext(FilterInternalContext);
  if (!ctx) {
    throw new Error("useFilterSelector must be used within a FilterProvider");
  }

  // useSyncExternalStore requires subscribe and getSnapshot to be stable.
  // We provide subscribe/getSnapshot from ctx.
  const selected = useSyncExternalStore(
    ctx.subscribe,
    () => selector(ctx.getSnapshot()),
    () => selector(ctx.getSnapshot()) // server snapshot (same as client for this usage)
  );

  return selected as T;
}

/**
 * useFilterActions
 * Returns a stable object of action functions (memoized). Use this to call actions
 * without causing re-renders (because the object is stable).
 *
 * Example:
 * const { addFilter, clearFilters } = useFilterActions();
 */
export function useFilterActions() {
  const ctx = React.useContext(FilterInternalContext);
  if (!ctx) {
    throw new Error("useFilterActions must be used within a FilterProvider");
  }
  return ctx.actions;
}

/**
 * Backwards-compatible helper:
 * useFilterContext()
 * NOTE: returns { state, ...actions } but *this will snapshot the whole state once*.
 * Prefer using `useFilterSelector` + `useFilterActions` for minimal re-renders.
 */
export function useFilterContext() {
  const ctx = React.useContext(FilterInternalContext);
  if (!ctx)
    throw new Error("useFilterContext must be used within a FilterProvider");
  const fullState = ctx.getSnapshot(); // snapshot of current state (no subscription)
  return { state: fullState, ...ctx.actions } as {
    state: State;
    addFilter: typeof ctx.actions.addFilter;
    removeFilter: typeof ctx.actions.removeFilter;
    updateFilter: typeof ctx.actions.updateFilter;
    setFilters: typeof ctx.actions.setFilters;
    clearFilters: typeof ctx.actions.clearFilters;
    togglePreview: typeof ctx.actions.togglePreview;
    applyFilterSingle: typeof ctx.actions.applyFilterSingle;
    applyFilters: typeof ctx.actions.applyFilters;
    setTransformations: typeof ctx.actions.setTransformations;
    addTransformation: typeof ctx.actions.addTransformation;
    setGrouping: typeof ctx.actions.setGrouping;
    applyGrouping: typeof ctx.actions.applyGrouping;
    setGroupingPreview: typeof ctx.actions.setGroupingPreview;
    saveTransformations: typeof ctx.actions.saveTransformations;
    previewTransformations: typeof ctx.actions.previewTransformations;
    previewGrouping: typeof ctx.actions.previewGrouping;
    saveGrouping: typeof ctx.actions.saveGrouping;
    dispatch: typeof ctx.actions.dispatch;
  };
}
