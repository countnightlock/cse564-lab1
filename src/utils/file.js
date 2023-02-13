import { tsv } from 'd3-fetch';

export async function fetchData() {
    const data = await tsv("data/analysis.txt", (datum) => {
        return {
            uri: datum.uri,
            track_name: datum.track_name,
            album_name: datum.album_name,
            artist_name: datum.artist_name,
            danceability: +datum.danceability,
            energy: +datum.energy,
            key: datum.key,
            loudness: +datum.loudness,
            mode: +datum.mode,
            speechiness: +datum.speechiness,
            acousticness: +datum.acousticness,
            instrumentalness: +datum.instrumentalness,
            liveness: +datum.liveness,
            valence: +datum.valence,
            tempo: +datum.tempo,
            duration_ms: +datum.duration_ms,
            time_signature: +datum.time_signature,
        }
    });

    return data;
}