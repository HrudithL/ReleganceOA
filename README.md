# iris-ml-dashboard

Trains random forest and xgboost on the iris dataset, exports evaluation results to json, and shows them in a react dashboard.

## setup

```sh
pip install -r ml/requirements.txt --user
pip install -r backend/requirements.txt --user
npm install
npm install --prefix frontend
```

## running

```sh
npm run dev
```

Runs the notebook, starts the api on port 8000, and starts the frontend on port 5173. Both run in the same terminal. Ctrl+C stops everything.

To re-run the notebook without restarting the servers:

```sh
npm run export
```

## structure

```
notebooks/train_iris.ipynb   training pipeline + json export
backend/main.py              fastapi server, serves the report json
frontend/                    vite + react dashboard
ml/requirements.txt          python deps for training
backend/requirements.txt     python deps for api
artifacts/                   model_report.json goes here (gitignored)
```

## how it works

The notebook trains both models, then writes `artifacts/model_report.json` with accuracy, confusion matrices, feature importance, and per-sample predictions. The api just serves that file. The frontend reads it and renders the charts.
