import dynamic from "next/dynamic";
import { Component } from "react";
import S from "../components/Sightings";

export default function Sightings({ coords, setCoords }) {
  return <S coords={coords} setCoords={setCoords} />;
}