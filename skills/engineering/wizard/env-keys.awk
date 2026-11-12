# Prints only the key names assigned in a dotenv file, never values.
# Usage: awk -f env-keys.awk .env
# Lines inside an open quoted value (e.g. a multiline private key) are skipped.
{
  if (q) { t = $0; if (q == "\"") gsub(/\\./, "", t); if (index(t, q)) q = ""; next }
  if (match($0, /^[ \t]*(export[ \t]+)?[A-Za-z_][A-Za-z0-9_]*[ \t]*=/)) {
    k = substr($0, RSTART, RLENGTH - 1)
    sub(/^[ \t]*(export[ \t]+)?/, "", k); sub(/[ \t]+$/, "", k)
    print k
    v = substr($0, RSTART + RLENGTH); sub(/^[ \t]+/, "", v)
    c = substr(v, 1, 1)
    if (c == "\"" || c == "'") {
      t = substr(v, 2); if (c == "\"") gsub(/\\./, "", t)
      if (!index(t, c)) q = c
    }
  }
}
