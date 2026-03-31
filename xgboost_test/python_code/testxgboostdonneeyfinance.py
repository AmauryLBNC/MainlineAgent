from xgboost import XGBRegressor
import pandas as pd
from sklearn.model_selection import train_test_split

# ======================
# READ DATA
# ======================
df = pd.read_csv("xgboost_test_data.csv")

X = df.drop(columns=["target", "ticker"], errors="ignore")
y = df["target"]

# ======================
# SPLIT
# ======================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ======================
# MODEL
# ======================
model = XGBRegressor(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="reg:squarederror"
)

# ======================
# TRAIN
# ======================
model.fit(X_train, y_train)

# ======================
# PREDICT
# ======================
preds = model.predict(X_test)
# ======================
# COMPARE REAL vs PRED
# ======================
results = pd.DataFrame({
    "y_real": y_test.values,
    "y_pred": preds,
})

results["error"] = results["y_pred"] - results["y_real"]
results["abs_error"] = results["error"].abs()

print(results.head(10))

