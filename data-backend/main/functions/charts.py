import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import io, base64

# -----------------------------
# Universal Plot Function with Validation, Multi-Column Support & Base64 Return
# -----------------------------
def _plot_pie(data, x, y=None, hue=None):
    pal = sns.color_palette("Set1")

    # one pie per hue level (small multiples)
    if hue:
        levels = [lv for lv in data[hue].dropna().unique().tolist()]
        if len(levels) == 0:
            raise ValueError(f"No valid levels found in hue column '{hue}' for pie plot.")

        n = len(levels)
        ncols = min(3, n)
        nrows = ceil(n / ncols)
        fig, axes = plt.subplots(nrows, ncols, figsize=kwargs.pop("figsize", (6*ncols, 6*nrows)))
        axes = np.atleast_1d(axes).ravel()

        for ax, lv in zip(axes, levels):
            subset = data[data[hue] == lv]
            if y is not None:
                # single y only
                ycol = y if isinstance(y, str) else (y[0] if len(y) else None)
                if ycol is None:
                    agg = subset[x].value_counts()
                else:
                    if ycol not in subset.columns:
                        raise ValueError(f"Column '{ycol}' not found for pie values.")
                    agg = subset.groupby(x)[ycol].sum().sort_values(ascending=False)
            else:
                agg = subset[x].value_counts()

            colors = sns.color_palette("Set1", n_colors=len(agg))
            ax.pie(agg.values, labels=agg.index, autopct="%1.1f%%", startangle=90, colors=colors)
            ax.set_title(f"{hue} = {lv}")
            ax.axis("equal")

        # hide any unused axes
        for ax in axes[len(levels):]:
            ax.axis("off")

        plt.tight_layout()
        return axes[0]

    # single pie (no hue)
    ax = plt.gca()
    if y is not None:
        ycol = y if isinstance(y, str) else (y[0] if len(y) else None)
        if ycol is None:
            agg = data[x].value_counts()
        else:
            if ycol not in data.columns:
                raise ValueError(f"Column '{ycol}' not found for pie values.")
            agg = data.groupby(x)[ycol].sum().sort_values(ascending=False)
    else:
        agg = data[x].value_counts()

    colors = sns.color_palette("Set1", n_colors=len(agg))
    ax.pie(agg.values, labels=agg.index, autopct="%1.1f%%", startangle=90, colors=colors)
    ax.axis("equal")
    return ax


def plot_chart(data, chart, x=None, y=None, hue=None, style=None, size=None, kde=False, multiple=None, cols=None):
    """
    Universal plotting function for Seaborn with:
      - Error handling
      - Multi-column support (x, y, hue)
      - Returns Base64 PNG instead of Axes
    """

    # -----------------------------
    # Handle multi-column hue (combine)
    # -----------------------------
    if isinstance(hue, list):
        for col in hue:
            if col not in data.columns:
                raise ValueError(f"Hue column '{col}' not found in DataFrame.")
        hue_col = "_combined_hue"
        data[hue_col] = data[hue].astype(str).agg("-".join, axis=1)
        hue = hue_col

    # -----------------------------
    # Validation Rules
    # -----------------------------
    print("Validation Rules")
    if chart in ["scatter", "line"]:
        if x is None or y is None:
            raise ValueError(f"{chart.capitalize()} plot requires both x and y.")

    if chart in ["bar", "boxplot", "violin", "strip", "swarm"]:
        if x is None and y is None:
            raise ValueError(f"{chart.capitalize()} plot requires at least one axis (x or y).")

    if chart in ["histogram"]:
        if x is None and y is None:
            raise ValueError("Hist plot requires either x or y.")

    if chart == "count":
        if x is None and hue is None:
            raise ValueError("Count plot requires x or hue.")

    if chart == "heatmap":
        if cols is None:
            raise ValueError("Heatmap requires 'cols' parameter with numeric columns.")

    if chart == "pair":
        if cols is None:
            raise ValueError("Pairplot requires 'cols' parameter.")

    if chart == "joint":
        if x is None or y is None:
            raise ValueError("Jointplot requires both x and y.")
    if chart == "pie":
        if x is None:
            raise ValueError("Pie plot requires 'x' (labels).")
        if isinstance(y, list) and len(y) > 1:
            raise ValueError("Pie plot supports at most a single 'y' column (or None).")
        if isinstance(hue, list):
            raise ValueError("Pie plot does not support multiple hue columns. Use a single 'hue' or none.")

    print("Validation Ends")

    # -----------------------------
    # Multi-column x or y handling
    # -----------------------------
    def handle_multiple(columns, axis_name):
        for col in columns:
            if col not in data.columns:
                raise ValueError(f"Column '{col}' in {axis_name} not found in DataFrame.")

    if isinstance(x, list):
        handle_multiple(x, "x")
        imgs = []
        for col in x:
            imgs.append(plot_chart(data, chart, x=col, y=y, hue=hue, style=style, size=size, kde=kde, multiple=multiple, cols=cols))
        return imgs

    print("Multi-column x handling",y)
    
    if isinstance(y, list) and len(y) > 0:
        handle_multiple(y, "y")
        imgs = []
        for col in y:
            imgs.append(plot_chart(data, chart, x=x, y=col, hue=hue, style=style, size=size, kde=kde, multiple=multiple, cols=cols))
        return imgs
    
    print("Multi-column y handling")

    # -----------------------------
    # Dictionary as switch-case
    # -----------------------------
    print("Dictionary as switch-case")
    
    plt.figure(figsize=(15, 7))
    sns.set_style("darkgrid")
    plt.style.use("dark_background")
    plot_funcs = {
        "scatter": lambda: sns.scatterplot(data=data, x=x, y=y, hue=hue,palette='Set1'),
        "line":    lambda: sns.lineplot(data=data, x=x, y=y, hue=hue, style=style, size=size,palette="Set1"),
        "bar":     lambda: sns.barplot(data=data, x=x, y=y, hue=hue,palette="Set1"),
        "count":   lambda: sns.countplot(data=data, x=x, hue=hue,palette="Set1"),
        "histogram":lambda: sns.histplot(data=data, x=x, y=y, hue=hue, kde=kde, multiple=multiple,palette="Set1"),
        "boxplot": lambda: sns.boxplot(data=data, x=x, y=y, hue=hue,palette="Set1"),
        "violin":  lambda: sns.violinplot(data=data, x=x, y=y, hue=hue, split=True if hue else False),
        "strip":   lambda: sns.stripplot(data=data, x=x, y=y, hue=hue,palette="Set1"),
        "swarm":   lambda: sns.swarmplot(data=data, x=x, y=y, hue=hue,palette="Set1"),
        "heatmap": lambda: sns.heatmap(data[cols].corr() if cols else data.corr(), annot=True, cmap="coolwarm"),
        "pair":    lambda: sns.pairplot(data[cols] if cols else data, hue=hue,palette="Set1"),
        "joint":   lambda: sns.jointplot(data=data, x=x, y=y, hue=hue,palette="Set1"),
        "pie": lambda: _plot_pie(data, x, y, hue),
    }


    if chart not in plot_funcs:
        raise ValueError(f"Chart '{chart}' not supported.")

    print(chart)
    if chart == "bar" and (y is None or len(y) == 0):
        chart='count'
    print(chart)
        
    result = plot_funcs[chart]()

    # Handle seaborn-style plots (pairplot/jointplot)
    if chart in ["pair", "joint"]:
        fig = result.fig if hasattr(result, "fig") else result.ax.figure
    else:
        ax = result
        fig = ax.figure if ax else plt.gcf()
        if hasattr(ax, "legend_") and ax.legend_ is not None:
            ax.legend(loc="best")

    # Save to buffer
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight", dpi=300)
    buf.seek(0)

    # Encode in base64
    img_base64 = base64.b64encode(buf.read()).decode("utf-8")
    plt.close(fig)  # Close AFTER saving

    return f"data:image/png;base64,{img_base64}"
