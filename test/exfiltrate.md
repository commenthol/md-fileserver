<!-- CSP header prevents remove exfiltration -->

**remote**

<pre id="remote"> </pre>

**local**

<pre id="local"> </pre>

<script>
  fetch('https://httpbin.org/get?foo=bar').then(res => res.text()).then((text) => {
    document.getElementById('remote').textContent = text
  })
  fetch('http://localhost:4000/etc/passwd').then(res => res.text()).then((text) => {
    document.getElementById('local').textContent = text
  })
</script>
