# iris-ml-dashboard

Trains a random forest and xgboost classifier on the iris dataset and lets you compare them side by side in a react dashboard. Shows accuracy, confusion matrices, feature importance, and per-sample predictions.

## install

```sh
pip install -r ml/requirements.txt --user
pip install -r backend/requirements.txt --user
npm install
npm install --prefix frontend
```

## run

```sh
npm run dev
```

Opens the api on port 8000 and the dashboard on port 5173.
