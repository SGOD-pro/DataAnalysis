import io
import base64
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pandas as pd
import os
import uuid
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_CHARTS_DIR = os.path.join(BASE_DIR, "static", "charts")
os.makedirs(STATIC_CHARTS_DIR, exist_ok=True)
def plot_chart(df: pd.DataFrame, x: str, y: list[str], chart_type: str) -> str:
    """
    Generate different chart types (line, bar, scatter, pie, radar) using seaborn/matplotlib.
    Returns chart as a base64 string (PNG).
    """

    plt.figure(figsize=(7, 5))
    sns.set_style("whitegrid")

    if chart_type == "line":
        for col in y:
            sns.lineplot(x=df[x], y=df[col], label=col)
        plt.title("Line Chart")

    elif chart_type == "bar":
        # melt df for multiple y plotting
        melted = df.melt(id_vars=[x], value_vars=y, var_name="Variable", value_name="Value")
        sns.barplot(x=x, y="Value", hue="Variable", data=melted)
        plt.title("Bar Chart")

    elif chart_type == "scatter":
        for col in y:
            plt.scatter(df[x], df[col], label=col)
        plt.title("Scatter Plot")

    elif chart_type == "pie":
        if len(y) > 1:
            raise ValueError("Pie chart supports only one Y variable")
        values = df[y[0]]
        labels = df[x]
        plt.pie(values, labels=labels, autopct="%1.1f%%")
        plt.title("Pie Chart")

    elif chart_type == "radar":
        categories = list(df[x])
        N = len(categories)
        angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
        angles += angles[:1]

        ax = plt.subplot(111, polar=True)
        for col in y:
            values = df[col].tolist()
            values += values[:1]
            ax.plot(angles, values, label=col, linewidth=2)
            ax.fill(angles, values, alpha=0.25)
        ax.set_xticks(angles[:-1])
        ax.set_xticklabels(categories)
        plt.title("Radar Chart")

    else:
        raise ValueError(f"Unsupported chart type: {chart_type}")

    plt.legend(loc="best")

    # Save plot to buffer
    buf = io.BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight",dpi=300)
    plt.close()
    buf.seek(0)

    # # Encode as base64 string

    img_base64 = base64.b64encode(buf.read()).decode("utf-8")

    # ✅ Properly closed f-string
    return f"data:image/png;base64,{img_base64}"
