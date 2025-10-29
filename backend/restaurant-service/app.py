import os
from flask import Flask, jsonify, request, abort
from sqlalchemy.exc import IntegrityError
from db import Base, engine, SessionLocal
from models import Restaurant
from config import SERVICE_PORT
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=False,
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

@app.before_request
def init_db():
    # Create tables if not present (idempotent).
    Base.metadata.create_all(bind=engine)

@app.teardown_appcontext
def remove_session(exception=None):
    SessionLocal.remove()

@app.get("/healthz")
def healthz():
    return jsonify({"ok": True}), 200

@app.get("/restaurants")
def list_restaurants():
    session = SessionLocal()
    try:
        q = session.query(Restaurant).order_by(Restaurant.name.asc())
        cuisine = request.args.get("cuisine")
        if cuisine:
            q = q.filter(Restaurant.cuisine.ilike(f"%{cuisine}%"))
        data = [
            {
                "id": r.id,
                "name": r.name,
                "slug": r.slug,
                "cuisine": r.cuisine,
                "rating": float(r.rating) if r.rating is not None else None,
                "logo_key": r.logo_key,
            }
            for r in q.all()
        ]
        return jsonify(data), 200
    finally:
        session.close()

@app.get("/restaurants/<slug>")
def get_restaurant(slug: str):
    session = SessionLocal()
    try:
        r = session.query(Restaurant).filter(Restaurant.slug == slug).first()
        if not r:
            abort(404, description="Restaurant not found")
        data = {
            "id": r.id,
            "name": r.name,
            "slug": r.slug,
            "cuisine": r.cuisine,
            "rating": float(r.rating) if r.rating is not None else None,
            "logo_key": r.logo_key,
            "address_json": r.address_json,
        }
        return jsonify(data), 200
    finally:
        session.close()

@app.post("/restaurants")
def create_restaurant():
    # Admin/seed use only
    payload = request.get_json(force=True, silent=False)
    required = ["name", "slug", "logo_key"]
    if not all(k in payload for k in required):
        abort(400, description=f"Missing fields, required: {required}")
    session = SessionLocal()
    try:
        r = Restaurant(
            name=payload["name"],
            slug=payload["slug"],
            cuisine=payload.get("cuisine"),
            rating=payload.get("rating"),
            logo_key=payload["logo_key"],
            address_json=payload.get("address_json"),
        )
        session.add(r)
        session.commit()
        return jsonify({"id": r.id, "slug": r.slug}), 201
    except IntegrityError:
        session.rollback()
        abort(409, description="Slug already exists")
    finally:
        session.close()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=SERVICE_PORT)
